 using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using proyectKN.Filters;
using proyectKN.Models;
using proyectKN.Services;
using System.Net;
using System.Net.Http.Json;

namespace proyectKN.Controllers
{
    public class HomeController : Controller

    {

        private readonly IHttpClientFactory _http;
        private readonly IConfiguration _config;
        private readonly IPasswordHelper _password;

        public HomeController(IHttpClientFactory http, IConfiguration config, IPasswordHelper password)
        {
            _http = http;
            _config = config;
            _password = password;
        }

        [SesionActiva]
        [NoCache]
        [HttpGet]
        public IActionResult Index()
        {
            using var client = _http.CreateClient();

            var urlCitas = _config.GetValue<string>("Valores:UrlAPI") + "Cita/ConsultarCita";
            var responseCitas = client.PostAsync(urlCitas, null).Result;

            ViewBag.DebugStatus = responseCitas.StatusCode.ToString();

            if (responseCitas.IsSuccessStatusCode)
            {
                var listaCitas = responseCitas.Content
                    .ReadFromJsonAsync<List<CitaConsulta>>()
                    .Result;

                ViewBag.DebugCantidad = listaCitas.Count;

                ViewBag.CitasHoy = listaCitas
    .Where(c => c.FechaCita.Month == DateTime.Today.Month
             && c.FechaCita.Year == DateTime.Today.Year)
    .OrderBy(c => c.FechaCita)
    .ThenBy(c => c.HoraCita)
    .ToList();
            }
            else
            {
                ViewBag.DebugCantidad = 0;
                ViewBag.CitasHoy = new List<CitaConsulta>();
            }

            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }


        [HttpPost]
        public IActionResult Login(LoginRequest model)
        {
            using var client = _http.CreateClient();
            var url = _config.GetValue<string>("Valores:UrlAPI") + "Home/IniciarSesion";
            var result = client.PostAsJsonAsync(url, model).Result;

            var contenido = result.Content.ReadAsStringAsync().Result;

            if (result.StatusCode == HttpStatusCode.OK)
            {
                var objeto = result.Content.ReadFromJsonAsync<LoginResponseWeb>().Result;
                HttpContext.Session.SetString("IdUsuario", objeto.Consecutivo.ToString());
                HttpContext.Session.SetString("NombreUsuario", objeto!.NombreCompleto);
                HttpContext.Session.SetString("RolUsuario", objeto.NombreRol);

                return RedirectToAction("Index", "Home");
            }

            TempData["Error"] = contenido;
            return RedirectToAction("Login");
        }

        #region Recuperar Acceso
        [HttpGet]
        public IActionResult RecuperarAcceso()
        {
            return View(new RecuperarAccesoRequest());
        }

        [HttpPost]
        public IActionResult RecuperarAcceso(RecuperarAccesoRequest model)
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") + "Home/RecuperarAcceso";

            var result = client.PutAsJsonAsync(url, model).Result;

            if (result.StatusCode == HttpStatusCode.OK)
            {
                TempData["Success"] = "Se envió una nueva contraseña a su correo.";
                return RedirectToAction("Login", "Home");
            }
            var mensaje = result.Content.ReadAsStringAsync().Result;

            TempData["Error"] = string.IsNullOrWhiteSpace(mensaje)
        ? "Ocurrió un error al procesar la solicitud."
        : mensaje;

            return RedirectToAction("RecuperarAcceso");
        }

        #region Cerrar Sesión

        [SesionActiva]
        [HttpGet]
        public IActionResult CerrarSesion()
        {
            HttpContext.Session.Clear();

            Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
            Response.Headers["Pragma"] = "no-cache";
            Response.Headers["Expires"] = "0";

            return RedirectToAction("Login", "Home");
        }

        #endregion


        public IActionResult AccesoDenegado()
        {
            return View();
        }
    }
}
#endregion

