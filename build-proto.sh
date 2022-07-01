#!/bin/bash

npx protoc --ts_out src --proto_path protobuf protobuf/proto_proxy_in/main.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_proxy_in/set_file.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_proxy_in/delete_file.proto

npx protoc --ts_out src --proto_path protobuf protobuf/proto_proxy_out/main.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_proxy_out/files.proto

npx protoc --ts_out src --proto_path protobuf protobuf/proto_video/change_output.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_video/change_toolbox.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_video/main.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_video/move.proto
npx protoc --ts_out src --proto_path protobuf protobuf/proto_video/toggle_fs.proto