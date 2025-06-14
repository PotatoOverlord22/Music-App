using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;
using MM.Library.Models;

namespace MM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GenrePresetController : ControllerBase
    {
        private BLContext blContext;

        public GenrePresetController(BLContext blContext)
        {
            this.blContext = blContext;
        }

        [HttpGet("Presets")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPresets()
        {
            try
            {
                return Ok(await blContext.GenrePresetBL.GetPresetsForCurrentUser());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("UpdatePresets")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdatePresets([FromBody] List<GenrePresetDTO> genrePresets)
        {
            try
            {
                await blContext.GenrePresetBL.UpdatePresetsForCurrentUser(genrePresets);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
