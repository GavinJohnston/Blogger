using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Blogger.Models
{
	public class BloggerContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
		public BloggerContext(DbContextOptions<BloggerContext> options) : base(options)
		{
		}

		public DbSet<Category> Category { get; set; }
		public DbSet<Post> Post { get; set; }
		public DbSet<TitleInfo> TitleInfo { get; set; }
	}
}