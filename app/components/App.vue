<template>
    <Page @loaded="onLoaded">
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <StackLayout>
            <StackLayout>
                <Label class="message" :text="msg" col="0" row="0"/>
            </StackLayout>
            <StackLayout>
                <TextView v-model="data.message"></TextView>
            </StackLayout>
            <StackLayout>
                <Button text="Send All" @tap="onSendAll"></Button>
                <Button text="Send to Others" @tap="onSendToOthers"></Button>
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script >
    import {TnsEcho} from 'nativescript-laravel-echo';
    import * as http from 'tns-core-modules/http';
    const socketUrl = 'https://b53f70cb.ngrok.io    '; // ngrok url
    const apiUrl = 'https://b53f70cb.ngrok.io/api';
    const headers = {
        'Accept': 'application/json',
        'Content-type': 'application/json',
    };

    export default {
        data() {
            return {
                msg: 'Hello World!',
                data: {
                    message: ''
                },
                echo: null,
            }
        },
        created() {
            const token = `Bearer ${this.$localStorage.getItem('token')}`;
            headers['Authorization'] = token;
            this.echo = new TnsEcho({
                broadcaster: 'pusher',
                key: 'your_key',
                authEndpoint: 'your_app_url/broadcasting/auth',
                auth: {
                    headers: {
                        'Authorization': token
                    }
                }
            });
        },
        methods: {
            onLoaded() {

                // this.echo = new TnsEcho({
                //     host: socketUrl,
                //     broadcaster: 'socket.io',
                //     auth: {
                //         headers: {
                //             'Authorization': token
                //         }
                //     }
                // });
                // SocketIO
                this.echo.join('chat.1')
                    .here((users) => {
                        console.log(users);
                    })
                    .joining((user) => {
                        alert(`Joining ${user.name}'`);
                    })
                    .leaving((user) => {
                        alert(`leaving ${user.name}'`);
                    })
                    .listen('NewMessage', (e) => {
                        alert(e.message);
                    });

                setTimeout(() => {
                    console.log(this.echo.socketId());
                }, 500);

            },
            onSendAll() {
                headers['X-Socket-Id'] = this.echo.socketId();
                http.request({
                    url: `${apiUrl}/send-all`,
                    method: 'POST',
                    headers: headers,
                    content: JSON.stringify(this.data)
                }).then(({content}) => {
                    this.data.message = '';
                    let data = content.toJSON();
                    this.$localStorage.setItem('token', data.token);
                    this.$navigateTo(App)
                })
            },
            onSendToOthers() {
                headers['X-Socket-Id'] = this.echo.socketId();
                http.request({
                    url: `${apiUrl}/send-others`,
                    method: 'POST',
                    headers: headers,
                    content: JSON.stringify(this.data)
                }).then(({content}) => {
                    this.data.message = '';
                    let data = content.toJSON();
                    this.$localStorage.setItem('token', data.token);
                    this.$navigateTo(App)
                });
            }
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
