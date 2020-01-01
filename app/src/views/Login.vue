<template>
  <div class="auth-group blog-center">
    <a-form :form="user" class="form_login">
      <a-form-item>
        <a-input
          placeholder="请输入邮箱账号"
          v-decorator="['email' ,{ rules: [
          {pattern: emailPattern , message: '邮箱格式错误' }] }]"
          class="item"
        >
          <a-icon slot="prefix" type="global" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password placeholder="请输入密码" v-decorator="['password']" class="item">
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button
          @click="submitAction"
          class="blog-btn-block"
          type="primary"
          block
        >{{ submitLabel }}</a-button>
      </a-form-item>
      <a-form-item>
        或
        <a-button @click="switchPage" type="link">{{ switchLabel }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { register, login } from "@/services/user";
import Constant from "@/common/constant";
import { Token } from "@/store";
import config from "@/common/config";
import faker from "faker";

export default {
  name: "Login",
  data() {
    return {
      user: this.$form.createForm(this, { name: "user" }),
      emailPattern: config.emailPattern,
      registerPage: false,
      switchLabel: Constant.BUTTON_REGISTER,
      submitLabel: Constant.BUTTON_LOGIN
    };
  },
  watch: {
    registerPage: function(param) {
      if (param) {
        this.switchLabel = Constant.BUTTON_LOGIN;
        this.submitLabel = Constant.BUTTON_REGISTER;
      } else {
        this.switchLabel = Constant.BUTTON_REGISTER;
        this.submitLabel = Constant.BUTTON_LOGIN;
      }
    }
  },
  methods: {
    submitAction() {
      this.user.validateFields((err, values) => {
        if (!err) {
          if (this.registerPage) this.registerAction(values);
          else this.loginAction(values);
        }
      });
    },
    registerAction(values) {
      if (values.email && values.password) {
        register(values.password, values.email, faker.image.avatar()).then(
          res => {
            if (res.ok) {
              this.$message.warning(Constant.TIPS_REGISTER_DONE);
              this.registerPage = false;
            } else {
              this.$message.warning(Constant.TIPS_REGISTER_FAILED);
            }
          }
        );
      } else {
        if (this.emailFormatOK) {
          this.$message.warning(Constant.TIPS_FORM_NOT_EMPTY);
        } else {
          this.$message.warning(Constant.TIPS_MAIL_WRONG);
        }
      }
    },
    loginAction(values) {
      if (values.email && values.password) {
        login(values.email, values.password).then(res => {
          console.log(res);
          if (res.ok) {
            Token.saveToken({
              token: res.data.token,
              expire: res.data.expire
            });
            this.$router.push({ path: "/admin" });
          } else {
            this.$message.warning(Constant.TIPS_LOGIN_FAILED);
          }
        });
      } else {
        this.$message.warning(Constant.TIPS_FORM_NOT_EMPTY);
      }
    },

    switchPage: function() {
      this.registerPage = !this.registerPage;
    }
  }
};
</script>

<style>
.form_login {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.auth-group {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.pointer {
  cursor: pointer;
}

.login-register {
  margin-left: 14rem;
  color: #409eff;
  font-size: 1rem;
}
</style>
