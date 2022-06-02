# 📍 내용 정리

## 💡 들어가기 전 알아야 하는 것들

- ExpressJS  
  node.js를 위한 웹 프레임워크 중 하나, 사실상 node.js의 표준 서버 프레임워크로 불린다. nodejs를 서버로 쉽게 구성할 수 있도록 해주는 게 express 프레임워크.  
  즉, express는 nodejs를 쉽게 서버로 구성할 수 있게 만든 클래스와 라이브러리들을 모아둔 것이다. - node.js  
   node.js는 자바스크립트를 웹 브라우저, 웹 사이트 뿐만 아니라 외부에서도 사용할 수 있게 해주는 cross-platform 엔진이다.
- app.get()

  ```js
  app.get(PATH, HANDLER);
  app.post(PATH, HANDLER);
  ```

  여기서 `app`은 express 객체  
   METHOD에는 HTTP 요청 메소드로 GET, POST 방식이 있다.  
   `PATH`는 해당하는 프로젝트 내의 서버 경로  
   `HANDLER`는 라우트가 일치할 때 발생하는 함수

  - 라우팅  
    라우팅은 URI(또는 경로) 및 특정한 HTTP 요청 메소드(GET, POST 등)인 특정 엔드포인트에 대한 클라이언트 요청에 애플리케이션이 응답하는 방법을 결정하는 것을 말한다.  
    각 라우트는 하나 이상의 핸들러 함수를 가질 수 있으며, 이러한 함수는 라우트가 일치할 때 실행된다.

  - 라우트의 사용  
     홈 페이지에서 Hello World!로 응답 :
    ```js
    // GET 방식의 METHOD
    app.get("/", function (req, res) {
      res.send("Hello World!");
    });
    ```
    애플리케이션의 홈 페이지인 루트 라우트(/)에서 POST 요청에 응답 :
    ```js
    app.post("/", function (req, res) {
      res.send("Got a POST request");
    });
    ```
    /user 라우트에 대한 PUT 요청에 응답 :
    ```js
    app.put("/user", function (req, res) {
      res.send("Got a PUT request at /user");
    });
    ```
    /user 라우트에 대한 DELETE 요청에 응답 :
    ```js
    app.delete("/user", function (req, res) {
      res.send("Got a DELETE request at /user");
    });
    ```

- Pug  
  pug는 템플릿 엔진 중 하나이다. 템플릿 엔진은 자바스크립트를 이용하여 HTML을 렌더링할 수 있게 해준다.  
  참조 : https://inpa.tistory.com/374

- (req, res) =>  
   express.js 라우트 요청 객체(`req`), 응답 객체(`res`)

  참조 : https://luckyyowu.tistory.com/346

  https://velog.io/@leitmotif/%EB%9D%BC%EC%9A%B0%ED%8C%85-%EB%B6%84%EB%A6%AC%EC%99%80-reqresuri

- babel  
   자바스크립트 컴파일러. 최신 버전의 자바스크립트 문법은 브라우저가 이해하지 못하기 때문에 babel이 브라우저가 이해할 수 있는 문법으로 변환해준다.

  참조 : https://ljs0705.medium.com/babel-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-a1d0e6bd021a

- package.json  
   패키지에 관한 정보와 의존중인 버전에 관한 정보를 담고 있다.

  참조 : https://www.zerocho.com/category/NodeJS/post/5825a3caaff5c70018279975

- nodemon  
  nodemon은 프로젝트를 살펴보고 변경사항이 있을 시 서버를 재시작해주는 프로그램이다.

  Node.js 개발 시 자바 스크립트 파일들을 수정 할때마다 매번 ctrl+c를 통해 node를 종료 후 다시 실행해줘야 하는 번거로움 이 있었습니다.하지만 파일들을 모니터링하고 있다가 수정될 경우 자동으로 서버를 재실행시켜주는 스크립트 모니터링 유틸리티 nodemon를 이용하면 번거로움이 상당히 줄어듭니다.

  출처: https://inpa.tistory.com/entry/NODE-📚-nodemon-설치 [👨‍💻 Dev Scroll:티스토리]

## zoom clone

- express로 할 일은 views를 설정해주고 render 해주는 것
- 나머지는 websocket 에서 실시간으로 일어난다

- nodemon 재시작  
   app.js와 같은 프론트엔드 자바스크립트를 수정할 때 말고  
   views나 서버를 수정할 때만 nodemon이 재시작되도록 하기 위해  
   nodemon.json에 `ignore` 추가

- nodejs 기본적인 설정
  - Pug로 view engine 설정
  - Express에 template이 어딨는지 지정해주고
  - public url을 생성해서 유저에게 파일을 공유해주고
  - home.pug를 render 해주는 route handler를 만듦

---

### WebSocket

- HTTP

  - stateless : backend가 유저를 기억하지 못함
  - request와 response 과정 뒤에 백엔드는 유저를 잊어버림
  - reponse를 주면 끝남 그리고 다시 request를 기다림
  - 내가 누구인지 알려주는 cookie를 서버로 보내야 함
  - 서버가 유저가 누구인지 잊어버리는 걸 stateless라고 함
  - 서버는 오직 request를 받을 때만 reponse를 줌
  - real-time으로 일어나지 않는다
  - 서버가 유저에게 불쑥 대화를 걸 수가 없음
  - 서버는 유저가 물어봐야 답할 수 있다

- WebSocket

  - http와는 전혀 다른 프로토콜
  - 웹소켓 연결이 일어날 땐 마치 악수처럼 작동
  - 브라우저가 서버로 웹소켓 리퀘를 보내면 서버가 받거나 거절하거나
  - 한 번 연결이 성립되면 양방향 연결이 생긴다
  - 연결된다는 것은 브라우저와 서버가 서로 커뮤니케이션 하는 터널이 있다는 것
  - 연결돼있기 때문에 서버는 유저가 누군지 기억
  - 원한다면 서버가 유저에게 먼저 메세지를 보낼 수 있음
  - 서버는 리퀘를 기다리지 않아도 됨
  - request, response 과정이 필요 없음
  - bi-directional : 양방향 연결
  - 이 모든 것들은 connection 중일 때만 발생
  - 브라우저는 서버에게 어느 때나 메세지를 보낼 수 있고 서버는 브라우저에게 어느 때나 메세지를 보낼 수 있다.
  - 브라우저와 백엔드 사이 뿐만 아니라 백엔드와 백엔드 사이에서도 가능 (http도 마찬가지)
  - 프론트엔드에서 아무것도 설치하지 않아도 브라우저에서 지원해줘서 사용 가능
  - 프론트엔드에서 `btn.addEventListener("click", fn)` 하듯이 webSocket에도 event가 있고, event가 발동될 때 사용할 function을 만들면 됨

## socket

- socket.send

  - 메세지를 구분하기 위해서 string이 아닌 json 타입의 값을 보내고 싶음
  - socket에 send 할 때 string 타입 밖에 못 보냄 -> Json 보내려면? -> `JSON.stringify`, `JSON.parse` 를 사용하자

- socket은 객체이므로 내맘대로 프로퍼티 추가 가능

## 🍎 Socket IO 🍎

- front-end와 back-end 간 실시간 통신을 가능하게 해주는 프레임워크 또는 라이브러리
- 실시간 기능을 만드는 데 더 편리한 기능 제공
- 실시간, 양방향, event 기반의 통신을 가능하게 함
- socket IO는 webSocket을 실행하는 게 아님
- socket IO는 웹소켓의 부가 기능이 아님
- websocket은 Socket IO가 실시간, 양방향, event 기반 통신을 제공하는 방법 중 하나
- websocket 이용이 불가능하면 socket IO는 다른 방법을 이용해 계속 작동할 것
- 우리에게 신뢰성을 주는 것
- 브라우저가 주는 websocket은 socket IO와 호환이 안되므로(부가기능이 아니므로) 브라우저에 설치를 해야 함
- 브라우저에 socketIO를 설치하면, io라는 function을 볼 수 있다
  - io : 자동으로 백엔드 socket.io와 연결해주는 function, 알아서 socket.io를 실행하고 있는 서버를 찾음
- 💡 socket.emit(event, payload, function)
  - 만들고 싶은 어떤 event라도 보낼 수 있음
  - emit을 하면 argument를 보낼 수 있음 (js object도 가능), 하나가 아닌 여러개 전송 가능
  - 🌟 프론트엔드에서 백엔드로 function을 보내고 백엔드에서 그 함수를 호출하면 프론트엔드에서 그 함수가 실행됨 🌟 굉장히 중요한 기능!!!
    프론트엔드에 있는 코드를 호출은 백엔드가 했는데 실행은 프론트엔드에서 되다니,,~
    예를 들어 처리 비용이 크고 오래 걸리는 작업을 한다고 했을 때, 프론트엔드에 작업을 완료했다고 알리고 싶은 경우 사용 가능, 즉 끝났을 때 실행하는 함수 (websocket에서는 불가)  
    별다른 거 필요없이 마지막 argument를 function으로 주면 됨  
    함수를 통해 백엔드->프론트엔드 argument도 전달할 수 있음!!
