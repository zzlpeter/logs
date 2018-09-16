<template>
    <Row style="background:#eee;padding:20px">
        <Col span="11">
            <Card :bordered="false">
                <p slot="title">
                    <Dropdown trigger="click" style="margin-left: 20px">
                      <a href="javascript:void(0)">
                          {{ left.options[left.value] }}
                          <Icon type="ios-arrow-down"></Icon>
                      </a>
                      <DropdownMenu slot="list">
                        <DropdownItem v-for="(key, value) in left.options" :selected="value==left.value?true:false">
                          <span @click="dropdownChange(value, 'left')">{{key}}</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  <Button v-if="left.status=='close'"
                          type="text" style="float: right;margin-top: -8px;color: blue;"
                          icon="ios-eye" @click="open('left')">
                    链接
                  </Button>
                  <Button v-else type="text"
                          style="float: right;margin-top: -8px;color: red;"
                          icon="md-close" @click="close('left')">
                    断开
                  </Button>
                </p>
                <Input type="textarea" v-model="left.log" class="account_textarea" readonly="true" />
            </Card>
        </Col>
        <Col span="11" offset="1">
            <Card shadow>
                <p slot="title">
                    <Dropdown trigger="click" style="margin-left: 20px">
                      <a href="javascript:void(0)">
                          {{ right.options[right.value] }}
                          <Icon type="ios-arrow-down"></Icon>
                      </a>
                      <DropdownMenu slot="list">
                        <DropdownItem v-for="(key, value) in right.options" :selected="value==right.value?true:false">
                          <span @click="dropdownChange(value, 'right')">{{key}}</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  <Button v-if="right.status=='close'"
                          type="text" style="float: right;margin-top: -8px;color: blue;"
                          icon="ios-eye" @click="open('right')">
                    链接
                  </Button>
                  <Button v-else type="text"
                          style="float: right;margin-top: -8px;color: red;"
                          icon="md-close" @click="close('right')">
                    断开
                  </Button>
                </p>
                <Input type="textarea" v-model="right.log" class="account_textarea" readonly="true" />
            </Card>
        </Col>
    </Row>
</template>

<script>
export default {
  name: 'Logs',
  data () {
    return {
      left: {
          options: {
              'account': '账号/权限',
              'ban': '禁止操作',
              'diamond': '金币/钻石',
              'withdraw': '提现审核',
              'record': '记录查询',
              'batch': '批量付款',
              'trivial': 'trivial提现审核',
              'invitation': 'invitation提现审核',
              'package': '背包管理'
          },
          value: 'account',
          status: 'close',
          log: '',
          socket: ''
      },
      right: {
          options: {
              'all': '接口'
          },
          value: 'all',
          status: 'close',
          log: '',
          socket: ''
      }
    }
  },
  methods: {
      dropdownChange: function (pak, choice) {
          if(this[choice].value!=pak){
              this[choice].value = pak;
              this.close(choice);
              this.open(choice);
          }
      },
      changePackage: function (choice) {
          this[choice].log = '';
          if(this[choice].socket){
              this[choice].socket.close();
              delete this[choice].socket;
          }
          this.makeSocket(this[choice].value, choice);
      },
      makeSocket: function (pak, choice) {

          let socket = new WebSocket("ws://127.0.0.1:9009/");
          let that = this;
          this[choice].socket = socket;
          socket.onopen = function () {
              that[choice].status = 'open';
              that.$Message.success('链接已打开');
              console.log('WebSocket open');//成功连接上Websocket
              console.log(pak);
              socket.send(pak);//发送数据到服务端
          };
          socket.onmessage = function (e) {
              console.log('message: ' + e.data);//打印服务端返回的数据
              that[choice].log += e.data;
          };
          socket.onclose = function (e) {
              that.$Message.success('链接已关闭');
          };
      },
      open: function (choice) {
          this.changePackage(choice);
      },
      close: function (choice) {
          this[choice].status = 'close';
          if(this[choice].socket){
              this[choice].socket.close();
          }
      },
  }
}
</script>


<style>
  .account_textarea {
    height: 600px;
  }
  .account_textarea textarea {
    max-height: 100%;
    height: 100%;
  }
</style>

