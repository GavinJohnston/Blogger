using System;
using Microsoft.EntityFrameworkCore;

namespace Blogger.Models
{
	public class BloggerContext : DbContext
	{
		public BloggerContext(DbContextOptions<BloggerContext> options) : base(options)
		{
		}

		public DbSet<Category> Category { get; set; }
		public DbSet<Post> Post { get; set; }
		public DbSet<TitleInfo> TitleInfo { get; set; }
	}
}

