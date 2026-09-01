using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace proyectKN.Filters
{
    public class SesionActivaAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // Si la acción es pública, no validar sesión
            if (context.ActionDescriptor.EndpointMetadata
                .Any(m => m is PublicoAttribute))
            {
                base.OnActionExecuting(context);
                return;
            }

            var idUsuario = context.HttpContext.Session.GetString("IdUsuario");

            if (string.IsNullOrEmpty(idUsuario))
            {
                context.Result = new RedirectToActionResult("Login", "Home", null);
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}