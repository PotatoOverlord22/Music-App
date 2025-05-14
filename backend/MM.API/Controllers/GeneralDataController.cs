using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;

namespace MM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GeneralDataController : ControllerBase
    {
        private BLContext blContext;

        public GeneralDataController(BLContext blContext)
        {
            this.blContext = blContext;
        }

        [HttpGet("Moods")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetMoods()
        {
            try
            {
                return Ok(blContext.GeneralDataBL.GetMoods());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("TimesOfDay")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetTimesOfDay()
        {
            try
            {
                return Ok(blContext.GeneralDataBL.GetTimesOfDay());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}