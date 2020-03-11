<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title"></Label>
        </ActionBar>
        <StackLayout>
            <StackLayout>
                <TextField v-model="user.email"></TextField>
            </StackLayout>
            <StackLayout>
                <TextField v-model="user.password" secure="true"></TextField>
            </StackLayout>
            <StackLayout>
                <Button text="Login" @tap="onLogin"></Button>
            </StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import * as http from 'tns-core-modules/http';
    import App from "./App";

    const apiUrl = 'https://b53f70cb.ngrok.io/api';

    export default {
        name: "Login",
        data() {
            return {
                user: {
                    email: 'test@mail.com',
                    password: 'password'
                }
            }
        },
        methods: {
            onLogin() {
                http.request({
                    url: `${apiUrl}/login`,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                    },
                    content: JSON.stringify(this.user)
                }).then(({content}) => {
                    let data = content.toJSON();
                    this.$localStorage.setItem('token', data.token);
                    this.$navigateTo(App)
                })
            }
        }
    };
</script>

<style scoped>

</style>