using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;

namespace MM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MusicController : ControllerBase
    {
        private BLContext blContext;

        public MusicController(BLContext blContext)
        {
            this.blContext = blContext;
        }

        [HttpPost("TransformSong")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> TransformSong([FromForm] IFormFile file)
        {
            try
            {
                byte[] transformedfile = await blContext.MusicBL.TransformSong(file);
                return File(transformedfile, "audio/mpeg", $"{file.FileName}-transformed.mp3");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("TransformSongWithContext")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> TransformSongWithContext([FromForm] IFormFile file, [FromForm] string timeOfDay, [FromForm] string mood, [FromForm] float intensity)
        {
            try
            {
                (byte[] transformedSong, string recommendedGenre) = await blContext.MusicBL.TransformSongWithContext(file, timeOfDay, mood, intensity);
                Response.Headers.Append("X-Recommended-Genre", recommendedGenre);

                return File(transformedSong, "audio/mpeg", $"{file.FileName}-transformed.mp3");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}