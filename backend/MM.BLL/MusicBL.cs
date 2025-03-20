using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;
using MM.BLL.Mappers;
using MM.Library.Models;
using System.Net.Http.Headers;

namespace MM.BLL
{
    public class MusicBL : BLObject
    {
        #region Members
        private readonly string _flaskProcessAudioEndpoint = "http://localhost:5000/process_audio";
        private readonly HttpClient _httpClient;
        #endregion Members

        #region Constructor
        public MusicBL(BLContext bLContext) : base(bLContext)
        {
            _httpClient = new HttpClient();
        }
        #endregion Constructor

        #region Methods
        public async Task<byte[]> TransformSong(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                LogAndThrowValidationException("No file received");
            }

            Uri proccessAudioEndpoint = new Uri(_flaskProcessAudioEndpoint);
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

            HttpResponseMessage response = await _httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseContentRead);
            if (!response.IsSuccessStatusCode)
            {
                LogAndThrowValidationException($"Flask API error: {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsByteArrayAsync();
        }

        protected override void ConfigureMapper()
        {
            MapperConfiguration mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<SongMapperProfile>();
            });

            _mapper = mapperConfig.CreateMapper();
        }
        #endregion Methods
    }
}