using Microsoft.AspNetCore.Mvc;

namespace MusicMania.Controllers
{
    public class MusicProcessingController : ControllerBase
    {
        [HttpPost("process")]
        public async Task<IActionResult> ProcessMusic([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided.");

            var pythonServiceUrl = "http://localhost:5000/process-music";

            try
            {
                using (var client = new HttpClient())
                {
                    using (var content = new MultipartFormDataContent())
                    {
                        using (var fileStream = file.OpenReadStream())
                        {
                            var fileContent = new StreamContent(fileStream);
                            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("audio/wav");
                            content.Add(fileContent, "file", file.FileName);

                            var response = await client.PostAsync(pythonServiceUrl, content);
                            response.EnsureSuccessStatusCode();

                            var responseContent = await response.Content.ReadAsStringAsync();
                            return Ok(responseContent);
                        }
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error connecting to the Python service: {ex.Message}");
            }
        }

        /*[HttpPost("process2")]
        public async Task<IActionResult> ProcessMusic2([FromForm] IFormFile file)
        {
            var pythonServiceUrl = "http://localhost:5000/process-music"; // Python service URL
            using (var client = new HttpClient())
            {
                try
                {
                    var response = await client.PostAsync(pythonServiceUrl, null);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return Ok(responseContent);
                }
                catch (HttpRequestException ex)
                {
                    return StatusCode(500, $"Error connecting to the Python service: {ex.Message}");
                }
            }
        }*/
    }
}
