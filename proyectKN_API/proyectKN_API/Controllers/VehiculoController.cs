using Dapper;
using proyectKN_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
namespace proyectKN_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VehiculoController : ControllerBase
{
    private readonly IConfiguration _config;
    public VehiculoController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("RegistrarVehiculo")]
    public IActionResult RegistrarVehiculo(VehiculoRequest model)
    {
        using var context = new SqlConnection(
            _config.GetValue<string>("ConnectionStrings:DefaultConnection"));

        if (model.Anio == 0)
            return BadRequest("El año es obligatorio.");

        var anioTexto = model.Anio.ToString();

        if (anioTexto.Length != 4)
            return BadRequest("El año debe tener 4 dígitos.");

        if (model.Telefono == 0)
            return BadRequest("El teléfono es obligatorio.");


        var telefonoTexto = model.Telefono.ToString();

        if (telefonoTexto.Length != 8)
            return BadRequest("El teléfono debe tener 8 dígitos.");

        if (string.IsNullOrWhiteSpace(model.Placa))
            return BadRequest("La placa es obligatoria");

        var placaTexto = model.Placa.ToString();

        if (placaTexto.Length != 6)
            return BadRequest("La placa debe tener 6 dígitos.");


        var parametros = new DynamicParameters();
        parametros.Add("@Nombre_Cliente", model.Nombre_Cliente);
        parametros.Add("@Telefono", model.Telefono);
        parametros.Add("@Cedula", model.Cedula);
        parametros.Add("@Placa", model.Placa);
        parametros.Add("@Marca", model.Marca);
        parametros.Add("@Modelo", model.Modelo);
        parametros.Add("@Anio", model.Anio);
        parametros.Add("@Problema", model.Problema);
        parametros.Add("@Revision", model.Revision);
        parametros.Add("@Estado", model.Estado);
        parametros.Add("@Deuda", model.Deuda);
        parametros.Add("@Monto", model.Monto);

        var result = context.QueryFirst<int>(
            "sp_RegistroVehiculo", 
            parametros,
             commandType: System.Data.CommandType.StoredProcedure
             );

        if (result == -1)
            return BadRequest("La placa ya está registrada");


        if (result == 1)
        {
            var parametrosIngreso = new DynamicParameters();

            parametrosIngreso.Add("@Descripcion",
                "Reparación vehículo " + model.Placa);

            parametrosIngreso.Add("@Monto", model.Monto);

            parametrosIngreso.Add("@Saldo_Pendiente", model.Deuda);


            context.Execute(
                "sp_RegistroIngresoVehiculo",
                parametrosIngreso,
                commandType: System.Data.CommandType.StoredProcedure
            );


            return Ok("Vehículo registrado correctamente");
        }

        return BadRequest("No se pudo registrar el vehículo");
    }

    [HttpPost("ConsultarVehiculos")]
    public IActionResult ConsultarVehiculo()
    {
        using var context = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        var lista = context.Query<VehiculoResponse>("sp_ConsultarVehiculos",
            commandType: System.Data.CommandType.StoredProcedure).ToList();

        if (!lista.Any())
            return NotFound("No hay Vehículos registrados");

        return Ok(lista);
    }

    [HttpPut("EditarVehiculo")]
    public IActionResult EditarVehiculo([FromBody] VehiculoRequest model)
    {
        if (model.Consecutivo <= 0)
            return BadRequest("El ID no es válido");
        if (model.Anio == 0)
            return BadRequest("El año es obligatorio");

        var anioTexto = model.Anio.ToString();

        if (anioTexto.Length != 4)
            return BadRequest("El año debe tener 4 dígitos");

        if (model.Telefono == 0)
            return BadRequest("El teléfono es obligatorio");

        if (string.IsNullOrWhiteSpace(model.Placa))
            return BadRequest("La placa es obligatoria");

        var telefonoTexto = model.Telefono.ToString();

        if (telefonoTexto.Length != 8)
            return BadRequest("El teléfono debe tener 8 dígitos");

        using var context = new SqlConnection(
            _config.GetConnectionString("DefaultConnection"));

        var parametros = new DynamicParameters();
        parametros.Add("@Consecutivo", model.Consecutivo);
        parametros.Add("@Nombre_Cliente", model.Nombre_Cliente);
        parametros.Add("@Telefono", model.Telefono);
        parametros.Add("@Cedula", model.Cedula);
        parametros.Add("@Placa", model.Placa);
        parametros.Add("@Marca", model.Marca);
        parametros.Add("@Modelo", model.Modelo);
        parametros.Add("@Anio", model.Anio);
        parametros.Add("@Problema", model.Problema);
        parametros.Add("@Revision", model.Revision);
        parametros.Add("@Estado", model.Estado);
        parametros.Add("@Deuda", model.Deuda);
        parametros.Add("@Monto", model.Monto);

        var result = context.QueryFirst<int>(
            "sp_EditarVehiculo",
            parametros,
            commandType: System.Data.CommandType.StoredProcedure
        );

        if (result <= 0)
            return BadRequest("No se pudo actualizar el vehículo");

        return Ok("Vehículo actualizado correctamente");
    }

    [HttpGet("ObtenerVehiculoId/{id}")]
    public IActionResult ObtenerVehiculoId(int id)
    {
        using var context = new SqlConnection(
            _config.GetConnectionString("DefaultConnection"));

        var parametros = new DynamicParameters();
        parametros.Add("@Consecutivo", id);

        var vehiculo = context.QueryFirstOrDefault<VehiculoResponse>(
            "sp_ObtenerVehiculoId",
            parametros,
            commandType: System.Data.CommandType.StoredProcedure
        );

        if (vehiculo == null)
            return NotFound("Vehículo no encontrado");

        return Ok(vehiculo);
    }

    [HttpGet("ConsultarPorPlaca/{placa}")]
    public IActionResult ConsultarPorPlaca(string placa)
    {
        using var context = new SqlConnection(
            _config.GetConnectionString("DefaultConnection"));

        var parametros = new DynamicParameters();
        parametros.Add("@Placa", placa);

        var vehiculo = context.QueryFirstOrDefault<VehiculoResponse>(
            "sp_ConsultarVehiculoPorPlaca",
            parametros,
            commandType: System.Data.CommandType.StoredProcedure
        );
        if (vehiculo == null)
            return NotFound(new { message = "Vehículo no encontrado" });

        return Ok(vehiculo);
    }

}