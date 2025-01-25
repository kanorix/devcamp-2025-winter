
## 初回セットアップ

### Artifact Registryのリポジトリを作成

```
cd terraform
terraform apply -target=google_artifact_registry_repository.default
```

## 手動ビルド

### DockerイメージをビルドしてArtifact Registryにpushする

```
cd frontend
docker build -f Dockerfile --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/kanorix-devcamp-2025/devcamp-2025/frontend:latest .
docker push asia-northeast1-docker.pkg.dev/kanorix-devcamp-2025/devcamp-2025/frontend:latest
```

### 環境のデプロイ

```
cd terraform
terraform apply
```

## トラブルシューティング

### dockerのbuild時にエラーが表示される

```
ERROR: failed to solve: node:18-alpine: failed to do request: Head "https://registry-1.docker.io/v2/library/node/manifests/18-alpine": dial tcp: lookup registry-1.docker.io on 127.0.0.53:53: no such host
```

- colimaホストマシンのDNS設定を変更する
   1.  `resolv.conf`をホストマシンで作成する
        ```
        nameserver 8.8.8.8
        nameserver 8.8.4.4
        nameserver 127.0.0.53
        options edns0 trust-ad
        search .
        ```
   2. colimaのVMに入り、`resolve.conf`をVMの`/run/systemd/resolve/stub-resolv.conf`にコピーする
        ```
        # colima ssh
        $ sudo cp resolve.conf /run/systemd/resolve/stub-resolv.conf
        ```
