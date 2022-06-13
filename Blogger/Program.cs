using Blogger.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Blogger.Areas.Identity.Data;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("BloggerIdentityDbContextConnection") ?? throw new InvalidOperationException("Connection string 'BloggerIdentityDbContextConnection' not found.");

builder.Services.AddDbContext<BloggerIdentityDbContext>(options =>
    options.UseSqlServer(connectionString)); 

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<BloggerIdentityDbContext>();;

builder.Services.AddControllers().AddNewtonsoftJson();


//builder.Services.AddDbContext<BloggerContext>(options => {
//    options.UseSqlServer(builder.Configuration.GetConnectionString("connectionString"));
//});

//builder.Services.AddDefaultIdentity<IdentityUser>
//    (options =>
//    {
//        options.SignIn.RequireConfirmedAccount = false;
//        options.Password.RequireDigit = false;
//        options.Password.RequiredLength = 6;
//        options.Password.RequireNonAlphanumeric = false;
//        options.Password.RequireUppercase = false;
//        options.Password.RequireLowercase = false;
//    })
//.AddEntityFrameworkStores<BloggerContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

