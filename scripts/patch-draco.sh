#!/bin/sh
# Fix: three-stdlib DRACOLoader creates Worker blobs without MIME type,
# causing modern browsers to reject them as 'application/octet-stream'.
sed -i.bak 's|URL.createObjectURL(new Blob(\[body\]))|URL.createObjectURL(new Blob([body], { type: "application/javascript" }))|g' \
  node_modules/three-stdlib/loaders/DRACOLoader.js \
  node_modules/three-stdlib/loaders/DRACOLoader.cjs 2>/dev/null
rm -f node_modules/three-stdlib/loaders/DRACOLoader.js.bak \
      node_modules/three-stdlib/loaders/DRACOLoader.cjs.bak 2>/dev/null
echo "Patched DRACOLoader MIME type"
