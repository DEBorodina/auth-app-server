import { MessageDto } from "../dtos/MessageDto";
import { IMessage, messageModel } from "../models/Message";

class MessageService {
  async getMessages() {
    const messages = await messageModel.find({});
    const messagesDto = messages.map((message) => new MessageDto(message));
    return messagesDto;
  }

  async addMessage(message: IMessage) {
    await messageModel.create(message);
    return await this.getMessages();
  }
}

export const messageService = new MessageService();
