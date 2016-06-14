var fs = require("fs");

/**
 * Createa a file reader
 * @param {string} file
 * @constructor
 */
function DicManager(file) {
	this.file = file;
	// this.fd = fs.openSync(this.file, "r");
	this.lines =fs.readFileSync(file, "utf8").split("\n");
}

/**
 * @typedef {object} entry
 * @property {string} word     - 見出語
 * @property {string} trans    - 訳語
 * @property {string} exp      - 用例
 */

/**
 * Search entry by keyword
 * @param {string|RegExp} key
 * @param {number} [mode=0] - 0:全文一致, 1:文頭一致, 2:部分一致, 3:正規表現
 * @param {function} callback
 */
DicManager.prototype.searchByKey = function(key, mode, callback) {
	if (typeof mode == "function") {
		callback = mode;
		mode = 0;
	}
	var ret = [];

	this.lines.forEach(function(line) {
		var entry = {};
		var tmp = line.indexOf(" /// ");
		if (tmp < 0) {
			return;
		}
		entry.word = line.substr(0, tmp);
		if (mode == 0) {
			if (entry.word != key) {
				return;
			}
		} else if (mode == 1) {
			if (entry.word.substr(0, key.length) != key) {
				return;
			}
		} else if (mode == 2) {
			if (entry.word.indexOf(key) < 0) {
				return;
			}
		} else if (mode == 3) {
			if (entry.word.search(key) < 0) {
				return;
			}
		}
		var rest = line.substr(tmp + 5);
		tmp = rest.indexOf(" / ");
		if (tmp >= 0) {
			entry.trans = rest.substr(0, tmp).replace(/ \\ /g, "\n");
			entry.exp = rest.substr(tmp + 3).replace(/ \\ /g, "\n");
		} else {
			entry.trans = rest;
			entry.exp = "";
		}
		ret.push(entry);
	});
	callback(ret);
};

module.exports = DicManager;
