using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MM.BLL.Context;
using MM.Library.Models;
using System.Security.Claims;

namespace MM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private BLContext blContext;

        public UserController(BLContext blContext)
        {
            this.blContext = blContext;
        }

        [HttpPost("Sync")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Sync([FromBody] UserDTO userDTO)
        {
            try
            {
                var currentAuth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (currentAuth0Id != userDTO.Auth0Id)
                {
                    return Forbid();
                }

                await blContext.UserBL.SyncUserAsync(userDTO);
                Console.WriteLine($"User {userDTO.Auth0Id} synced successfully.");
                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Stats")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                UserStatsDTO stats = await blContext.UserStatsBL.GetUserStats();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}