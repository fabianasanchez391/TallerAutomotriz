
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using proyectKN_API.Models;
using System.Data;
namespace proyectKN_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProveedorController : ControllerBase
{
    private readonly IConfiguration _config;

    public ProveedorController(IConfiguration config)
    {
        _config = config;
    }

    //  REGISTRO PROVEEDOR
    [HttpPost("RegistroProveedor")]
    public IActionResult RegistroProveedor(ProveedorRequest model)
    {
        using var context = new SqlConnection(
            _config.GetValue<string>("ConnectionStrings:DefaultConnection"));

        if (model.Telefono == 0)
            return BadRequest("El teléfono es obligatorio.");

        var telefonoTexto = model.Telefono.ToString();

        if (telefonoTexto.Length != 8)
            return BadRequest("El teléfono debe tener 8 dígitos.");
        model.Estado = 1;
        var parametros = new DynamicParameters();
        parametros.Add("@Nombre", model.Nombre);
        parametros.Add("@Telefono", model.Telefono);
        parametros.Add("@Correo", model.Correo);
        parametros.Add("@Direccion", model.Direccion);
        parametros.Add("@Estado", model.Estado);

        var result = context.QueryFirst<int>(
    "sp_RegistroProveedor",
    parametros,
    commandType: System.Data.CommandType.StoredProcedure
);

        if (result == -1)
            return BadRequest("El proveedor se encuentra registrado");

        if (result == -2)
            return BadRequest("El correo pertenece a un proveedor registrado");

        if (result == -3)
            return BadRequest("El teléfono pertenece a un proveedor registrado");

        if (result != 1)
            return BadRequest("El proveedor no se registró");

        return Ok("Proveedor registrado correctamente");
    }


    //  CONSULTA INVENTARIO
    [HttpPost("ConsultarProveedor")]
    public IActionResult CConsultarProveedor()
    {
        using var context = new SqlConnection(
            _config.GetConnectionString("DefaultConnection"));

        var lista = context.Query<ProveedorResponse>(
            "sp_ConsultarProveedor",
            commandType: System.Data.CommandType.StoredProcedure
        ).ToList();

        if (!lista.Any())
            return NotFound("No hay proveedores registrados");

        return Ok(lista);
    }

    //EDITAR    
    [HttpPut("EditarProveedor")]
    public IActionResult EditarProveedor(ProveedorRequest model)
    {
        using var context = new SqlConnection(
            _config.GetConnectionString("DefaultConnection"));
        if (model.Telefono == 0)
            return BadRequest("El teléfono es obligatorio.");

        var telefonoTexto = model.Telefono.ToString();

        if (telefonoTexto.Length != 8)
            return BadRequest("El teléfono debe tener 8 dígitos.");
      
        var parametros = new DynamicParameters();

        parametros.Add("@Consecutivo", model.Consecutivo);
        parametros.Add("@Nombre", model.Nombre);
        parametros.Add("@Telefono", model.Telefono);
        parametros.Add("@Correo", model.Correo);
        parametros.Add("@Direccion", model.Direccion);
 
       
        var result = context.QueryFirst<int>(
            "sp_EditarProveedor",
            parametros,
            commandType: System.Data.CommandType.StoredProcedure);

        if (result == 1)
            return Ok("Proveedor actualizado correctamente");

        if (result == -1)
            return BadRequest("El nombre ya está registrado");

        if (result == -2)
            return BadRequest("El correo ya está registrado");

        if (result == -3)
            return BadRequest("El teléfono ya está registrado");

        return BadRequest("No se pudo actualizar el proveedor");
    }

    //obtener proveedor para inventario 
    [HttpPost("ObtenerProveedores")]
    public IActionResult ObtenerProveedores()
    {
        using var context = new SqlConnection(
            _config.GetValue<string>("ConnectionStrings:DefaultConnection"));

        var result = context.Query<ProveedorResponse>(
            "sp_ObtenerProveedores",
            commandType: System.Data.CommandType.StoredProcedure
        ).ToList();

        if (result == null || !result.Any())
            return NotFound("No hay proveedores registrados");

        return Ok(result);
    }
    [HttpPost("CambiarEstadoProveedor")]
    public IActionResult CambiarEstadoProveedor([FromBody] ProveedorEstadoRequest model)
    {
        using var context = new SqlConnection(
            _config.GetValue<string>("ConnectionStrings:DefaultConnection"));

        var parametros = new DynamicParameters();
        parametros.Add("@Consecutivo", model.Consecutivo);

        context.Execute(
            "sp_CambiarEstadoProveedor",
            parametros,
            commandType: CommandType.StoredProcedure
        );

        return Ok();
    }
}



