<template>
  <div>
    <a-form :form="Password">
      <a-form-item :wrapper-col="wrapperCol">
        <a-input-password
          v-decorator="['oldPwd', { rules: [{ required: true, message: '请输入原密码' }] }]"
          placeholder="旧密码"
        />
      </a-form-item>
      <a-form-item :wrapper-col="wrapperCol">
        <a-input-password
          v-decorator="['newPwd', { rules: [{ required: true, message: '请输入新密码' }] }]"
          placeholder="新密码"
        />
      </a-form-item>
      <a-form-item :wrapper-col="wrapperCol">
        <a-input-password
          v-decorator="['surePwd', { rules: [{ required: true, message: '请再次确认新密码' }] }]"
          placeholder="请确认新密码"
        />
      </a-form-item>

      <a-form-item >
        <a-button @click="handleSubmit" type="primary" html-type="submit">确认</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { modifyPassword } from "@/services/user";
export default {
  name: "Password",
  data() {
    return {
      Password: this.$form.createForm(this, { name: "password" }),
      wrapperCol: { span: 6 }
    };
  },
  methods: {
    handleSubmit() {
      this.Password.validateFields((err, values) => {
        if (!err) {
          if(values.newPwd != values.surePwd) {
            this.$message.info('两次密码不一致')
            return
          }
          modifyPassword({
            old_pwd: values.oldPwd,
            new_pwd: values.newPwd
          }).then(res => {
            if(res.ok) {
              this.$message.success('修改成功')
            }else {
              this.$message.error('原密码错误')
            }
            this.Password.setFieldsValue({oldPwd:'',newPwd:'',surePwd:''})
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
