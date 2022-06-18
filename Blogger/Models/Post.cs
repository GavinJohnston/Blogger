using System;
namespace Blogger.Models
{
	public class Post
	{
		public int Id { get; set; }
		public string? Title { get; set; }
		public string? Content { get; set; }
		public DateTime Date { get; set; } = DateTime.Now.Date.ToLocalTime();
		public int CategoryId { get; set; }
		public string? FullName { get; set; }
	}
}

