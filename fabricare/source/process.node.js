// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

import path from 'path';
import svgtofont from './node_modules/svgtofont/lib/index.js';

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
		version : "0.546.0",
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
