project_root=$( cd "$(dirname "${BASH_SOURCE[0]}")/.." ; pwd -P )

if [[ ! -e ${project_root}/src/config/index.json ]]; then
    echo "{}" > src/config/index.json
    echo "wrote empty index.json"
else
  echo "index.json already exists"
fi
