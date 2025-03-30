# タスクを行う上でのルール

## 全体ルール
* GitHub側に投げるissueやPull request/commit messageやソースコード内のコメントは必ず英語で行うこと
* ソースコード自体（変数名、関数名、クラス名など）も英語で記述すること
* こちらに説明する際は日本語で行うこと
* commitはGitHub tokenの保持者として行うこと
  * Git configのuser.nameとuser.emailをGitHub tokenの持ち主の情報に設定すること
  * コミットメッセージは英語で、明確かつ簡潔に記述すること
  * コミットメッセージの先頭は動詞の原形（Add, Fix, Update, Refactor, Remove など）で始めること
* GitHubへの接続はAPI経由で行うこと（ブラウザは推奨しないが、APIで不可能な場合は許可）
* issueを立てる際には以下を含めること：
  - AS IS（現状整理）
  - TO BE（あるべき状態）
  - 現状を基にやるべき実行プラン
  - チェックリスト
  - 図解説明をする場合はmermaidで書くこと
* PRを書く際には関連するissueをリンクすること（closeできそうならclose:付きで）
* PRはドラフトではなく、最初から通常のPR（open状態）として作成すること