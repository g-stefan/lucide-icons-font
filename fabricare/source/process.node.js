// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

const svgtofont = require('svgtofont');
const path = require('path');

svgtofont({
	src : path.resolve(process.cwd(), 'temp/svg'),
	dist : path.resolve(process.cwd(), 'output'),
	fontName : 'lucide-icons',
	classNamePrefix : 'lucide',
	css : true,
	svgicons2svgfont : {
		fontHeight : 1536,
		normalize : false
	},
	website : {
		title : "Custom Lucide Icons Font",
		version : "0.515.0",
		logo : "",
		meta : {
			description : "",
			keywords : ""
		},
		description : ``,
		links : [
			{
				title: "Lucide Icons",
				url: "https://github.com/lucide-icons/lucide"
      			}
		],
		footerInfo : `Licensed under ISC license.`
	}
}).then(() => {
	console.log('done!');
});
