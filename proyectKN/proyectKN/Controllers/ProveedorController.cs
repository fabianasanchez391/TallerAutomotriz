using AspNetCoreGeneratedDocument;
using Microsoft.AspNetCore.Mvc;
using proyectKN.Filters;
using proyectKN.Models;
using System.Net;

namespace proyectKN.Controllers
{
    [SesionActiva]
   
    public class ProveedorController : Controller
    {
        private readonly IHttpClientFactory _http;
        private readonly IConfiguration _config;

        public ProveedorController(IHttpClientFactory http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        // GET REGISTRO PROVEEDOR
        [HttpGet]
        public IActionResult RegistroProveedor()
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") + "Proveedor/ConsultarProveedor";
            var urlEstados = _config.GetValue<string>("Valores:UrlAPI") + "Estado/ObtenerEstado/1";
            var response = client.PostAsync(url, null).Result;
            //Estado

            var responseEstados = client.GetAsync(urlEstados).Result;

            if (responseEstados.IsSuccessStatusCode)
            {
                ViewBag.Estado = responseEstados.Content
                                                 .ReadFromJsonAsync<List<EstadoM>>()
                                                 .Result;
            }
            else
            {
                ViewBag.Estado = new List<EstadoM>();
            }

            if (response.IsSuccessStatusCode)
            {
                ViewBag.Proveedores = response.Content
                                               .ReadFromJsonAsync<List<ProveedorConsulta>>()
                                               .Result;
            }
            else
            {
                ViewBag.Proveedores = new List<ProveedorConsulta>();
            }
            
            return View();
        }

        // POST REGISTRO PROVEEDOR
        [HttpPost]
        public IActionResult RegistroProveedor(Proveedor model)
        {
            using var client = _http.CreateClient();
            model.Estado = 1;

            var url = _config.GetValue<string>("Valores:UrlAPI") + "Proveedor/RegistroProveedor";

            var result = client.PostAsJsonAsync(url, model).Result;


            if (result.IsSuccessStatusCode)
            {
                TempData["Success"] = "Proveedor registrado correctamente";
            }
            else
            {
                var error = result.Content.ReadAsStringAsync().Result;

                TempData["Error"] = string.IsNullOrWhiteSpace(error)
                    ? "No se pudo registrar el proveedor"
                    : error;
            }

            return RedirectToAction("RegistroProveedor");
        }

       
        
        //EDITAR GET
        [HttpGet]
        public IActionResult EditarProveedor(int id)
        {
            using var client = _http.CreateClient();
            var responseEstados = client.GetAsync(
              _config.GetValue<string>("Valores:UrlAPI") + "Estado/ObtenerEstado/1"
          ).Result;

            if (responseEstados.IsSuccessStatusCode)
            {
                ViewBag.Estado = responseEstados.Content
                                                .ReadFromJsonAsync<List<EstadoM>>()
                                                .Result;
            }
            else
            {
                ViewBag.Estado = new List<EstadoM>();
            }
            var url = _config.GetValue<string>("Valores:UrlAPI") + "Proveedor/ConsultarProveedor";

            var response = client.PostAsync(url, null).Result;

            if (response.IsSuccessStatusCode)
            {
                var lista = response.Content
                    .ReadFromJsonAsync<List<Proveedor>>()
                    .Result;

                var proveedor = lista.FirstOrDefault(x => x.Consecutivo == id);

                if (proveedor == null)
                {
                    return Content("No se encontró el proveedor con id: " + id);
                }

                return View(proveedor);
            }

            return RedirectToAction("RegistroProveedor");
        }
        //EDITAR POST
        [HttpPost]
        public IActionResult EditarProveedor(Proveedor model)
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") + "Proveedor/EditarProveedor";

            var result = client.PutAsJsonAsync(url, model).Result;
            var responseEstados = client.GetAsync(
                    _config.GetValue<string>("Valores:UrlAPI") + "Estado/ObtenerEstado/1").Result;

            if (responseEstados.IsSuccessStatusCode)
                ViewBag.Estado = responseEstados.Content.ReadFromJsonAsync<List<EstadoM>>().Result;
            else
                ViewBag.Estado = new List<EstadoM>();

            if (result.IsSuccessStatusCode)
            {
                TempData["Success"] = "Proveedor actualizado correctamente";
                return RedirectToAction("RegistroProveedor");
            }
            else
            {
                TempData["Error"] = result.Content.ReadAsStringAsync().Result;


                model.Telefono = 0;

                return RedirectToAction("RegistroProveedor");
            }
        }
        [HttpPost]
        public IActionResult CambiarEstadoProveedor([FromBody] Proveedor model)
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") +
                      "Proveedor/CambiarEstadoProveedor";

            var result = client.PostAsJsonAsync(url, model).Result;

            if (result.IsSuccessStatusCode)
            {
                return Json(new
                {
                    success = true,
                    mensaje = "Estado actualizado correctamente"
                });
            }
            else
            {
                var error = result.Content.ReadAsStringAsync().Result;

                return Json(new
                {
                    success = false,
                    mensaje = error
                });
            }
        }
    }
}
