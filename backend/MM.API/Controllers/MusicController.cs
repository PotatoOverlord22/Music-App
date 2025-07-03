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
        public async Task<IActionResult> TransformSong([FromForm] IFormFile file, [FromForm] float intensity, [FromForm] float segmentLength, [FromForm] float overlapLength)
        {
            try
            {
                byte[] transformedfile = await blContext.MusicBL.TransformSong(file, intensity, segmentLength, overlapLength);
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
        public async Task<IActionResult> TransformSongWithContext([FromForm] IFormFile file, [FromForm] string timeOfDay, [FromForm] string mood, [FromForm] float contextBias, [FromForm] float intensity, [FromForm] int segmentLength, [FromForm] float overlapLength)
        {
            try
            {
                (byte[] transformedSong, string recommendedGenre) = await blContext.MusicBL.TransformSongWithContext(file, timeOfDay, mood, contextBias, intensity, segmentLength, overlapLength);
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