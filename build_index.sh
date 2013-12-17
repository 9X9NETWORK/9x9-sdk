#!/bin/sh

echo '<!DOCTYPE HTML>'
echo '<html lang="zh-tw">'
echo '<head>'
cat index.head.tpl
echo '</head>'
echo '<body>'
markdown index.body.markdown
echo '</body>'
echo '</html>'

