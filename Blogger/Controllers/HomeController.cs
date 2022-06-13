using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Blogger.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.JsonPatch;

namespace Blogger.Controllers;

[Route("")]
[ApiController]
public class HomeController : Controller
{
    private readonly BloggerContext _context;


    public HomeController(BloggerContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    [Route("Admin")]
    public IActionResult Admin()
    {
        return View();
    }

    /** TITLE INFO **/

    [HttpGet]
    [Route("Info")]
    public async Task<ActionResult<IEnumerable<TitleInfo>>> getInfoList()
    {
        var items = await _context.TitleInfo.ToListAsync();

        return items;
    }

    [HttpPost]
    [Route("Info")]
    public async Task<ActionResult<TitleInfo>> postInfo(TitleInfo titleinfo)
    {
        _context.TitleInfo.Add(titleinfo);

        await _context.SaveChangesAsync();

        return Ok(titleinfo);
    }

    [HttpGet]
    [Route("Info/{id}")]
    public async Task<ActionResult<TitleInfo>> getInfo(int id)
    {
        var item = await _context.TitleInfo.FindAsync(id);

        if (item == null)
        {
            return NotFound();
        }

        return item;
    }

    [HttpPut]
    [Route("Info/{id}")]
    public async Task<IActionResult> putInfo(int id, TitleInfo titleInfo)
    {
        if (id != titleInfo.Id)
        {
            return BadRequest();
        }

        _context.Entry(titleInfo).State = EntityState.Modified;

        await _context.SaveChangesAsync();
        
        return Ok(titleInfo);
    }

    /** CATEGORY SECTION **/


    [HttpPost]
    [Route("Categories")]
    public async Task<ActionResult<Category>> PostTransaction(Category category)
    {
        _context.Category.Add(category);

        await _context.SaveChangesAsync();

        return Ok(category);
    }

    [HttpGet]
    [Route("Categories")]
    public async Task<ActionResult<IEnumerable<Category>>> getCategorylist()
    {
        var items = await _context.Category.ToListAsync();

        if (items == null)
        {
            return NotFound();
        }

        return items;
    }

    [HttpGet]
    [Route("Categories/{id}")]
    public async Task<ActionResult<Category>> getCategory(int id)
    {
        var item = await _context.Category.FindAsync(id);

        if (item == null)
        {
            return NotFound();
        }

        return item;
    }

    [HttpDelete]
    [Route("Categories/{id}")]
    public async Task<IActionResult> deleteCategory(int id)
    {
        var cat = await _context.Category.FindAsync(id);

        if (cat == null)
        {
            return NotFound();
        }

        _context.Category.Remove(cat);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch]
    [Route("categories/{id}")]
    public async Task<IActionResult> EditElement(int id, [FromBody] JsonPatchDocument<Category> patchEntity)
    {
        var Cat = await _context.Category.FindAsync(id);

        if (Cat == null)
        {
            return NotFound();
        }

        patchEntity.ApplyTo(Cat, ModelState);

        _context.Entry(Cat).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return Ok(Cat);
    }

    /** POST **/

    [HttpPost]
    [Route("Post")]
    public async Task<ActionResult<Category>> postPost(Post post)
    {
        _context.Post.Add(post);

        await _context.SaveChangesAsync();

        return Ok(post);
    }

    [HttpGet]
    [Route("Posts")]
    public async Task<ActionResult<IEnumerable<Post>>> getPostsList()
    {
        var items = await _context.Post.ToListAsync();

        if (items == null)
        {
            return NotFound();
        }

        return items;
    }

    [HttpDelete]
    [Route("Posts/{id}")]
    public async Task<IActionResult> deletePost(int id)
    {
        var post = await _context.Post.FindAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        _context.Post.Remove(post);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut]
    [Route("posts/{id}")]
    public async Task<ActionResult> putPost(int id, Post post)
    {
        if (id != post.Id)
        {
            return BadRequest();
        }

        _context.Entry(post).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return Ok(post);
    }


    [HttpGet]
    [Route("Posts/{id}")]
    public async Task<ActionResult<Post>> getPost(int id)
    {
        var item = await _context.Post.FindAsync(id);

        if (item == null)
        {
            return NotFound();
        }

        return item;
    }
}

