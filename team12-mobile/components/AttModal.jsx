import { KeyboardAvoidingView, Modal, Platform, View } from "react-native";

const AttModal = ({ isOpen, withInput, children, ...rest }) => {
  const content = withInput ? (
    <KeyboardAvoidingView
      className="flex items-center justify-center flex-1 px-3 bg-zinc-900/40 text-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View className="flex items-center justify-center flex-1 px-3 bg-zinc-900/40 text-white">
      {children}
    </View>
  );

  return (
    <Modal
      className="w-full h-ful "
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...rest}
    >
      {content}
    </Modal>
  );
};

export default AttModal;
