import commonmark from "commonmark";
import fs from "fs";

export var render = function (path) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(fs.readFileSync(path, {encoding: 'UTF-8'})); // parsed is a 'Node' tree

    return writer.render(parsed); // result is a String
};
