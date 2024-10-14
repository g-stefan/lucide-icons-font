// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor");

messageAction("make");

if (Shell.fileExists("temp/build.done.flag")) {
	return;
};

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("temp");
Shell.mkdirRecursivelyIfNotExists("temp/svg-1");
Shell.mkdirRecursivelyIfNotExists("temp/svg-2");
Shell.mkdirRecursivelyIfNotExists("temp/png-1");
Shell.mkdirRecursivelyIfNotExists("temp/png-2");
Shell.mkdirRecursivelyIfNotExists("temp/svg");

var outputPath = Shell.getcwd() + "\\output";

Shell.setenv("PATH", "C:\\Program Files\\Inkscape\\bin;" + Shell.getenv("PATH"));
// Inkscape problem [https://gitlab.com/inkscape/inkscape/-/issues/4716]
Shell.setenv("SELF_CALL","none");

// ---

runInPath("temp", function() {
	if (!Shell.directoryExists("node_modules")) {
		exitIf(Shell.system("7z x -aoa ../archive/svgtofont.7z"));
	};
});

// ---

var job = new Job();
var jobsCount = 0;

	var fileList = Shell.getFileList("source/icons/*.svg");
	for (var j = 0; j < fileList.length; ++j) {
		var filename = Shell.getFileName(fileList[j]);
		var basename = Shell.getFileBasename(filename);

		var newName = basename.replace("-outline", "").toLowerCaseAscii();

		var svgContent = Shell.fileGetContents(fileList[j]);
		Shell.filePutContents("temp/svg-1/" + newName + ".svg", svgContent);

		job.addThread(function(icon) {
			Shell.system("inkscape --export-type=\"png\" \"temp/svg-1/" + icon + ".svg\" \"--export-filename=temp/png-1/" + icon + ".png\" --export-width=768");
			if (!Shell.fileExists("temp/png-1/" + icon + ".png")) { // try again (can happen/antivirus scan)
				Shell.system("inkscape --export-type=\"png\" \"temp/svg-1/" + icon + ".svg\" \"--export-filename=temp/png-1/" + icon + ".png\" --export-width=768");
			};
			if (Shell.fileExists("temp/png-1/" + icon + ".png")) {
				Shell.system("quantum-script fabricare/source/process.qs.js \"" + icon + "\"");
				Shell.system("vtracer --mode polygon --gradient_step 4 --colormode bw --path_precision 2 --segment_length 4 --corner_threshold 45 --input \"temp/png-2/" + icon + ".png\" --output \"temp/svg-2/" + icon + ".svg\" 1>NUL");

				var svgContent = Shell.fileGetContents("temp/svg-2/" + icon + ".svg");
				svgContent = svgContent.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");
				Shell.filePutContents("temp/svg/" + icon + ".svg", svgContent);
			} else {
				Console.writeLn("Conversion SVG to PNG failed: " + icon);
			};
		}, null, [ newName ], ++jobsCount);
	};


var infoMap = [ "|", "/", "-", "\\" ];
job.onEnd = function(process) {
	Console.write(infoMap[process.info % infoMap.length] + " [" + process.info + "/" + jobsCount + "]\r");
};
job.process();
Console.write("\n");

Shell.copy("fabricare/source/process.node.js", "temp/process.node.js");
Shell.system("node ./temp/process.node.js");

var html = Shell.fileGetContents("output/index.html");
html = html.replace(".icons ul li.class-icon [class^=\"lucide-\"]{ font-size: 26px; }", ".icons ul li.class-icon [class^=\"lucide-\"]{ font-size: 24px; color: #000000 !important;}");
html = html.replace("<div><a target=\"_blank\" href=\"https://github.com/jaywcjlove/svgtofont\">Created By svgtofont</a></div>", "");
Shell.filePutContents("output/index.html", html);

Shell.removeFile("output/symbol.html");
Shell.removeFile("output/unicode.html");
Shell.removeFile("output/lucide-icons.eot");
Shell.removeFile("output/lucide-icons.less");
Shell.removeFile("output/lucide-icons.module.less");
Shell.removeFile("output/lucide-icons.scss");
Shell.removeFile("output/lucide-icons.styl");
Shell.removeFile("output/lucide-icons.svg");
Shell.removeFile("output/lucide-icons.symbol.svg");

var cssContent = Shell.fileGetContents("fabricare/source/lucide-icons.header.css");
cssContent += "\r\n";
cssFilter = Shell.fileGetContents("output/lucide-icons.css");
scan=cssFilter.indexOf("}") + 1;
cssContent += cssFilter.substring(cssFilter.indexOf("}",scan) + 1);
Shell.filePutContents("output/lucide-icons.css", cssContent);
Shell.system("minify output/lucide-icons.css > output/lucide-icons.min.css");
Shell.copy("fabricare/source/lucide-icons.license.txt", "output/lucide-icons.license.txt");

Shell.filePutContents("temp/build.done.flag", "done");
