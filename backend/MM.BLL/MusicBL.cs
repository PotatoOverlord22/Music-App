using AutoMapper;
using Microsoft.AspNetCore.Http;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.Library.Enums;
using MM.Library.Utils;
using System.Net.Http.Headers;

namespace MM.BLL
{
    public class MusicBL : BLObject
    {
        #region Members
        private static readonly string flaskBaseUrl = "http://localhost:5000";
        private readonly HttpClient httpClient;
        private static readonly float MIN_INTENSITY = 0.0f;
        private static readonly float MAX_INTENSITY = 100.0f;
        private static readonly int MIN_SEGMENT_LENGTH = 10;
        private static readonly int MAX_SEGMENT_LENGTH = 30;
        private static readonly float MIN_OVERLAP_LENGTH = 0.0f;
        private static readonly float MAX_OVERLAP_LENGTH = 5.0f;
        private static readonly float MAX_BIAS = 1.0f;
        private static readonly float MIN_BIAS = 0.0f;
        #endregion Members

        #region Constructor
        public MusicBL(BLContext bLContext) : base(bLContext)
        {
            httpClient = new HttpClient();
        }
        #endregion Constructor

        #region Methods
        public async Task<byte[]> TransformSong(IFormFile file, float intensity, int segmentLength, float overlapLength)
        {
            if (file == null || file.Length == 0)
            {
                LogAndThrowValidationException("No file received");
            }

            HttpResponseMessage response;
            try
            {
                response = await PostFormAsync("process_audio", file);
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

            if (intensity < MIN_INTENSITY || intensity > MAX_INTENSITY)
            {
                LogAndThrowValidationException($"Invalid intensity: {intensity}");
            }

            if (segmentLength < MIN_SEGMENT_LENGTH || segmentLength > MAX_SEGMENT_LENGTH)
            {
                LogAndThrowValidationException($"Invalid segment length: {segmentLength}");
            }

            if (overlapLength < MIN_OVERLAP_LENGTH || overlapLength > MAX_OVERLAP_LENGTH)
            {
                LogAndThrowValidationException($"Invalid overlap length: {overlapLength}");
            }

            Dictionary<string, string> formFields = new Dictionary<string, string>
            {
                { "intensity", intensity.ToString() },
                { "segment_duration", segmentLength.ToString() },
                { "overlap", overlapLength.ToString() }
            };

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

            if (intensity < MIN_INTENSITY || intensity > MAX_INTENSITY)
            {
                LogAndThrowValidationException($"Invalid intensity: {intensity}");
            }

            if (segmentLength < MIN_SEGMENT_LENGTH || segmentLength > MAX_SEGMENT_LENGTH)
            {
                LogAndThrowValidationException($"Invalid segment length: {segmentLength}");
            }

            if (overlapLength < MIN_OVERLAP_LENGTH || overlapLength > MAX_OVERLAP_LENGTH)
            {
                LogAndThrowValidationException($"Invalid overlap length: {overlapLength}");
            }

            if (contextBias < MIN_BIAS || contextBias > MAX_BIAS)
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

        protected override void ConfigureMapper()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<SongMapperProfile>();
            });

            mapper = mapperConfig.CreateMapper();
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
        #endregion Methods
    }
}