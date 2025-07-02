using AutoMapper;
using Microsoft.AspNetCore.Http;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.DAL.Models;
using MM.Library.Constants;
using MM.Library.Enums;
using MM.Library.Utils;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Security.Claims;

namespace MM.BLL
{
    public class MusicBL : BLObject
    {
        #region Members
        private static readonly string flaskBaseUrl = Environment.GetEnvironmentVariable("AI_API_BASE_URL") ?? "http://localhost:8000";
        private readonly HttpClient httpClient;

        #endregion Members

        #region Constructor
        public MusicBL(BLContext bLContext) : base(bLContext)
        {
            httpClient = new HttpClient();
        }
        #endregion Constructor

        #region Methods
        public async Task<byte[]> TransformSong(IFormFile file, float intensity, float segmentLength, float overlapLength)
        {
            if (file == null || file.Length == 0)
            {
                LogAndThrowValidationException("No file received");
            }

            if (intensity < MusicConfigurationConstants.MIN_INTENSITY || intensity > MusicConfigurationConstants.MAX_INTENSITY)
            {
                LogAndThrowValidationException($"Invalid intensity: {intensity}");
            }

            if (segmentLength < MusicConfigurationConstants.MIN_SEGMENT_LENGTH || segmentLength > MusicConfigurationConstants.MAX_SEGMENT_LENGTH)
            {
                LogAndThrowValidationException($"Invalid segment length: {segmentLength}");
            }

            if (overlapLength < MusicConfigurationConstants.MIN_OVERLAP_LENGTH || overlapLength > MusicConfigurationConstants.MAX_OVERLAP_LENGTH)
            {
                LogAndThrowValidationException($"Invalid overlap length: {overlapLength}");
            }

            Dictionary<string, string> formFields = new Dictionary<string, string>
            {
                { "intensity", intensity.ToString() },
                { "segment_duration", segmentLength.ToString() },
                { "overlap", overlapLength.ToString() }
            };

            HttpResponseMessage response;
            try
            {
                response = await PostFormAsync("process_audio", file, formFields);
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, "Error transforming song");
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                LogAndThrowValidationException($"Flask API error: {response.ReasonPhrase}");
            }

            await blContext.UserStatsBL.IncrementCurrentUserTransformSongStats();
            return await response.Content.ReadAsByteArrayAsync();
        }

        public async Task<(byte[], string)> TransformSongWithContext(IFormFile file, string timeOfDay, string mood, float contextBias, float intensity, int segmentLength, float overlapLength)
        {
            if (file == null || file.Length == 0)
            {
                LogAndThrowValidationException("No file received");
            }

            if (string.IsNullOrEmpty(timeOfDay) || string.IsNullOrEmpty(mood))
            {
                LogAndThrowValidationException("No context received");
            }

            if (!EnumUtils.IsValueInEnumCaseInsensitive<TimesOfDay>(timeOfDay))
            {
                LogAndThrowValidationException($"Invalid time of day: {timeOfDay}");
            }

            if (!EnumUtils.IsValueInEnumCaseInsensitive<Moods>(mood))
            {
                LogAndThrowValidationException($"Invalid mood: {mood}");
            }

            if (intensity < MusicConfigurationConstants.MIN_INTENSITY || intensity > MusicConfigurationConstants.MAX_INTENSITY)
            {
                LogAndThrowValidationException($"Invalid intensity: {intensity}");
            }

            if (segmentLength < MusicConfigurationConstants.MIN_SEGMENT_LENGTH || segmentLength > MusicConfigurationConstants.MAX_SEGMENT_LENGTH)
            {
                LogAndThrowValidationException($"Invalid segment length: {segmentLength}");
            }

            if (overlapLength < MusicConfigurationConstants.MIN_OVERLAP_LENGTH || overlapLength > MusicConfigurationConstants.MAX_OVERLAP_LENGTH)
            {
                LogAndThrowValidationException($"Invalid overlap length: {overlapLength}");
            }

            if (contextBias < MusicConfigurationConstants.MIN_BIAS || contextBias > MusicConfigurationConstants.MAX_BIAS)
            {
                LogAndThrowValidationException($"Invalid bias: {contextBias}");
            }

            Dictionary<string, string> formFields = new Dictionary<string, string>
            {
                { "time_of_day", timeOfDay.ToLower() },
                { "mood", mood.ToLower() },
                { "context_bias", contextBias.ToString() },
                { "intensity", intensity.ToString() },
                { "segment_duration", segmentLength.ToString() },
                { "overlap", overlapLength.ToString() }
            };

            HttpResponseMessage response = await PostFormAsync("process_audio_with_recommendation", file, formFields);
            byte[] transformedFile = await response.Content.ReadAsByteArrayAsync();
            string recommendedGenre = response.Headers.GetValues("X-Recommended-Genre").FirstOrDefault() ?? string.Empty;

            await blContext.UserStatsBL.IncrementCurrentUserTransformSongStats(true);
            return (await response.Content.ReadAsByteArrayAsync(), recommendedGenre);
        }

        private async Task<HttpResponseMessage> PostFormAsync(string endpoint, IFormFile? file, IDictionary<string, string>? formFields = null)
        {
            if (string.IsNullOrWhiteSpace(endpoint))
                throw new ArgumentException("Endpoint cannot be null or whitespace.", nameof(endpoint));

            var uri = new Uri($"{flaskBaseUrl}/{endpoint.TrimStart('/')}");

            using var multipart = new MultipartFormDataContent();

            if (formFields != null)
            {
                foreach (var kv in formFields)
                {
                    multipart.Add(new StringContent(kv.Value ?? string.Empty), kv.Key);
                }
            }

            string? auth0Id = GetCurrentUserAuth0Id();
            if (string.IsNullOrEmpty(auth0Id))
            {
                LogAndThrowValidationException("Auth0 ID not found for the current user.");
            }
            
            User? user = await blContext.DalContext.UserDAL.GetByAuth0Id(auth0Id!);
            List<GenrePreset> genrePresets = await blContext.DalContext.GenrePresetDAL.GetGenrePresetsForUser(user!);
            if (genrePresets.Count == 0)
            {
                genrePresets = GetAllDefaultGenrePresets();
            }

            var presetsToSerialize = genrePresets.Select(gp => new
            {
                gp.GenreName,
                Values = gp.Values.Select(v => new { v.BandIndex, v.Gain }).ToList()
            }).ToList();

            string genrePresetsJson = JsonConvert.SerializeObject(presetsToSerialize);
            multipart.Add(new StringContent(genrePresetsJson), "genre_presets", "genre_presets.json");

            if (file != null && file.Length > 0)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                ms.Seek(0, SeekOrigin.Begin);

                var fileContent = new ByteArrayContent(ms.ToArray());
                fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType ?? "application/octet-stream");
                multipart.Add(fileContent, "file", file.FileName);
            }

            using HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, uri)
            {
                Content = multipart
            };
            request.Headers.ExpectContinue = false;

            HttpResponseMessage response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseContentRead);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException(
                    $"Error calling Flask API ({response.StatusCode}): {body}");
            }

            return response;
        }

        private static GenrePreset? GetDefaultGenrePreset(string genreName)
        {
            if (string.IsNullOrWhiteSpace(genreName))
            {
                return null;
            }

            string normalizedGenreName = genreName.ToLower();

            if (DefaultGenrePresets.Presets.TryGetValue(normalizedGenreName, out float[]? gains))
            {
                var genrePreset = new GenrePreset
                {
                    Guid = Guid.NewGuid(),
                    GenreName = genreName,
                    Values = new List<GenrePresetValue>()
                };

                for (int i = 0; i < gains.Length; i++)
                {
                    genrePreset.Values.Add(new GenrePresetValue
                    {
                        Guid = Guid.NewGuid(),
                        BandIndex = i,
                        Gain = gains[i],
                        GenrePresetGuid = genrePreset.Guid
                    });
                }
                return genrePreset;
            }

            return null;
        }

        private static List<GenrePreset> GetAllDefaultGenrePresets()
        {
            var allPresets = new List<GenrePreset>();
            foreach (var entry in DefaultGenrePresets.Presets)
            {
                var preset = GetDefaultGenrePreset(entry.Key);
                if (preset != null)
                {
                    allPresets.Add(preset);
                }
            }
            return allPresets;
        }

        #endregion Methods
    }
}