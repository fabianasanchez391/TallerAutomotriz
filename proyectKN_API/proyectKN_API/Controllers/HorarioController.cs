using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using proyectKN_API.Models;
using System.Data;
using System.Runtime.CompilerServices;

namespace proyectKN_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class HorarioController : ControllerBase
    {
        private readonly IConfiguration _config;

        public HorarioController(IConfiguration config)
        {
            _config = config;

        }

        //REGISTRO
        [HttpPost("GuardarHorario")]
        public IActionResult GuardarHorario(HorarioRequest model)
        {
            if (model.Estado == 12 &&
                (model.HorasSeleccionadas == null || !model.HorasSeleccionadas.Any()))
            {
                return BadRequest("Debe de seleccionar una hora cuando el horario es Abierto");
            }
                using var context = new SqlConnection(
                _config.GetValue<string>("ConnectionStrings:DefaultConnection"));

            var parametros = new DynamicParameters();

            parametros.Add("@FechaInicio", model.FechaInicio);
            parametros.Add("@FechaFin", model.FechaFin);
            parametros.Add("@Horas", string.Join(",", model.HorasSeleccionadas));
            parametros.Add("@Estado", model.Estado);

            var resultado = context.QueryFirstOrDefault<int>(
                "sp_RegistroHorario",
                parametros,
                commandType: CommandType.StoredProcedure
             );

            return Ok("Guardado correctamente");
        }

        [HttpGet("ConsultarHorario")]
        public IActionResult ConsultarHorario()
        {
            using var context = new SqlConnection(
                _config.GetConnectionString("DefaultConnection"));

            var lista = context.Query<HorarioResponse>(
                "sp_ConsultaHorario",
                commandType: System.Data.CommandType.StoredProcedure
            ).ToList();

            return Ok(lista);
        }

        [HttpGet("ConsultarHorarioPorFecha/{fecha}")]
        public IActionResult ConsultarHorarioPorFecha(string fecha)
        {
            using var context = new SqlConnection(
                _config.GetConnectionString("DefaultConnection"));

            var fechaParsed = DateTime.Parse(fecha);

            var lista = context.Query<HorarioResponse>(
                "sp_ConsultarHorarioPorFecha",
                new { Fecha = fechaParsed },
                commandType: CommandType.StoredProcedure
            ).ToList();

            return Ok(lista);
        }


      
    }
}