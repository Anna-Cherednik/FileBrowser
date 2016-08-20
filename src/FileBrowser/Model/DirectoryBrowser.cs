using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileBrowser.Model
{
    public class DirectoryBrowser
    {
        public string path { get; set; }
        public List<string> dirs { get; set; }
        public List<string> files { get; set; }
        public CountFiles count { get; set; }
        public int level { get; set; }
    }
}
