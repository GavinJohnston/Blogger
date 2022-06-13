using System;
namespace Blogger.Models
{
	public class Category
	{
		public Category()
        {
			Post = new List<Post>();
        }

		public int Id { get; set; }
		public string? Name { get; set; }
		public bool Binned { get; set; }
		public string? Color { get; set; }

		public List<Post> Post { get; set; }
	}
}

