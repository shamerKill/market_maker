if [ ! -d "./src/app/services/proto/proto/" ]; then
  mkdir -p ./src/app/services/proto/proto/
fi

protoc -I=./src/assets/ ccxt.proto \
--js_out=import_style=typescript:./src/app/services/proto/proto \
--grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/app/services/proto/proto
