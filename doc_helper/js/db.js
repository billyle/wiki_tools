/**
 * 通过navicat数据库右键的 查看表结构->以html格式 会生成此数据库表的html格式的简介
 * 这个脚本可以根据此html来生成符合dokuwiki语法说明
 *
 * 使用方法：在生成的html中引入jquery和此文件，例如
 *
 * <script src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
 * <script src="js/db.js"></script>
 *
 * 然后点击页面的数据库名，就会在控制台中输出结果
 */
$(function () {
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    }

    function renderTable(table) {
        var tmplate = "==== #name ====\n\n"
            + "**【表名】: ** %%#name%%\n\n"
            + "**【描述】: ** \n\n"
            + "**【字段说明】: **\n\n"
            + "^ 字段名 ^ 说明 ^ 默认值 ^\n"
            + "#rows\n\n"
            + "----\n\n";
        var rowTmp = "| %%#name%% |  | #def |\n";

        var rows = "";
        for (var idx in table.rows) {
            var row = table.rows[idx];
            rows += rowTmp.replaceAll("#name", row.name).replaceAll("#def", row.def ? row.def : "无");
        }

        var rs = tmplate.replaceAll("#name", table.name).replaceAll("#rows", rows);
        return rs;
    }

    function renderDb(db) {
        var dbTemplate = "===== 聚范 #name 数据库说明文档 =====\n\n"
            + "----\n\n"
            + "==== 注意 ====\n\n"
            + "<color red>此文档可能更新不及时，如有冲突以数据库中的为准</color>\n\n"
            + "----\n\n"
            + "#tables";
        var tables = "";
        for (var idx in db.tables) {
            var table = db.tables[idx];
            tables += renderTable(table);
        }
        return dbTemplate.replaceAll("#name", db.name).replaceAll("#tables", tables);
    }

    $("h3").click(function () {
        var name = $("h3").text().slice(10);
        var tables = [];
        $("h4").each(function (idx, item) {
            var $table = $(item).next();
            var rows = [];
            $table.find("tr").each(function (idx, item) {
                if (idx == 0)
                    return;
                var name = $(item).find("td").eq(0).text();
                var def = $(item).find("td").eq(3).text();
                var row = {name: name, def: def};
                rows.push(row);
            });
            var table = {name: $(item).text(), rows: rows};
            tables.push(table);
        });
        var db = {name: name, tables: tables};
        var rs = renderDb(db);
        console.log(rs);
    });
});