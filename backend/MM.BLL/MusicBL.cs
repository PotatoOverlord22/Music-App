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
        private static readonly float MAX_INTENSITY = 1000.0f;
        #endregion Members

        #region Constructor
        public MusicBL(BLContext bLContext) : base(bLContext)
        {
            httpClient = new HttpClient();
        }
        #endregion Constructor

        #region Methods
        public async Task<byte[]> TransformSong(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                LogAndThrowValidationException("No file received");
            }

            Uri proccessAudioEndpoint = new Uri($"{flaskBaseUrl}/process_audio");
            HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, proccessAudioEndpoint);
            requestMessage.Headers.ExpectContinue = false;

            MultipartFormDataContent multipartContent = new MultipartFormDataContent("file");
            MemoryStream fileStream = new MemoryStream();

            try
            {
                await file.CopyToAsync(fileStream);
                fileStream.Seek(0, SeekOrigin.Begin);

                ByteArrayContent fileContent = new ByteArrayContent(fileStream.ToArray());
                fileContent.Headers.Add("Content-Type", "application/octet-stream");
                multipartContent.Add(fileContent, "file", file.FileName);
                requestMessage.Content = multipartContent;
            }
            catch (Exception ex)
            {
                LogAndThrowError(ex, "Error transforming song");
                return null;
            }

            HttpResponseMessage response = await httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseContentRead);
            if (!response.IsSuccessStatusCode)
            {
                LogAndThrowValidationException($"Flask API error: {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsByteArrayAsync();
        }

        public async Task<(byte[], string)> TransformSongWithContext(IFormFile file, string timeOfDay, string mood, float intensity)
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

            Dictionary<string, string> formFields = new Dictionary<string, string>
            {
                { "time_of_day", timeOfDay.ToLower() },
                { "mood", mood.ToLower() },
                { "intensity", intensity.ToString() }
            };

            HttpResponseMessage response = await PostFormAsync("process_audio_with_recommendation", file, formFields);
            byte[] transformedFile = await response.Content.ReadAsByteArrayAsync();
            string recommendedGenre = response.Headers.GetValues("X-Recommended-Genre").FirstOrDefault() ?? string.Empty;

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

        public async Task<HttpResponseMessage> PostFormAsync(string endpoint, IFormFile? file, IDictionary<string, string>? formFields = null)
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