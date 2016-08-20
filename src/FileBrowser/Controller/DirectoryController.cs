using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FileBrowser.Model;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace FileBrowser.Controller
{
    [Route("api/[controller]")]
    public class DirectoryController : ControllerBase
    {
        DirectoryBrowser element;

        // GET: api/directory
        [HttpGet]
        public DirectoryBrowser Get()
        {
            element = new DirectoryBrowser();
            element.level = 0;
            GetAllDrives();
            return element;
        }

        // POST: api/directory?response
        [HttpPost]
        public DirectoryBrowser Post([FromBody]JObject response)
        {
            element = new DirectoryBrowser();
            element.path = response["path"].ToString();
            SetPathAccordingLevel(response["path"].ToString(), 
                                  Convert.ToInt32(response["level"].ToString()), 
                                  response["selected"].ToString());
            if (element.level == 0)
                GetAllDrives();
            else
                Initialize();
           return element;
        }

        public void SetPathAccordingLevel(string _path, int _level, string _selected)
        {
            if (_selected == "..")
            {
                element.path = Path.GetDirectoryName(_path);
                element.level = _level - 1;
            }
            else
            {
                if (_level == 0)
                    element.path = _selected;
                else if (_level == 1)
                    element.path = _path  + _selected;
                else
                    element.path = _path + @"\" + _selected;
                element.level = _level + 1;
            }
        }

        public void Initialize()
        {
            element.dirs = new List<string>();
            DirectoryInfo di = new DirectoryInfo(element.path);

            foreach (var dir in di.GetDirectories())
            {
                element.dirs.Add(dir.Name);
            }
            element.dirs.Insert(0, "..");

            element.files = new List<string>();
            foreach (var fir in di.GetFiles())
            {
                element.files.Add(fir.Name);
            }

            element.count = new CountFiles();

            List<string> files = GetFiles(element.path, "*.*");

            foreach (var fil in files)
            {
                FileInfo fi = new FileInfo(fil);
                if (fi.Length < 10 * 1024 * 1024)
                    element.count.small++;
                else if ((fi.Length > 10 * 1024 * 1024) && (fi.Length < 50 * 1024 * 1024))
                    element.count.medium++;
                else if (fi.Length > 100 * 1024 * 1024)
                    element.count.large++;
            }
        }

        private List<string> GetFiles(string path, string pattern)
        {
            var files = new List<string>();

            try
            {
                files.AddRange(System.IO.Directory.GetFiles(path, pattern, SearchOption.TopDirectoryOnly));
                foreach (var directory in System.IO.Directory.GetDirectories(path))
                {
                    files.AddRange(GetFiles(directory, pattern));
                }
            }
            catch (Exception) { }

            return files;
        }

        public void GetAllDrives()
        {
            element.path = "Selected drive to show information";

            element.dirs = new List<string>();
            try
            {
                DriveInfo[] allDrives = DriveInfo.GetDrives();
                foreach (DriveInfo d in allDrives)
                {
                    element.dirs.Add(d.Name);
                }
            }
            catch(Exception) {   }

            element.files = new List<string>();
            element.count = new CountFiles();
        }
    }
}
