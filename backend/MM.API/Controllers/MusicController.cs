using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;

namespace MusicMania.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private BLContext _blContext;

        public MusicController(BLContext blContext)
        {
            _blContext = blContext;
        }

        [HttpPost("TransformSong")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> TransformSong([FromForm] IFormFile file)
        {
            try
            {
                byte[] transformedfile = await _blContext.MusicBL.TransformSong(file);
                return File(transformedfile, "audio/mpeg", $"{file.FileName}-transformed.mp3");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}