import { trpc } from '@/shared/utils/trpc/trpc';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useEffect, useRef, useState } from 'react';

const usePlayground = () => {
  const models = trpc.playgroundListModels.useQuery();
  const [systemMessage, setSystemMessage] = useState<string>('');
  // config
  const [temperature, setTemperature] = useState<number>(0.8);
  const [topP, setTopP] = useState<number>(0.9);
  const [maxTokens, setMaxTokens] = useState<number>(1024);
  // messages
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Hello'
        }
      ]
    }
  ]);

  const [selectedModelId, setSelectedModelId] = useState<string>(
    models.data?.[0].id || ''
  );
  const addMessage = () => {
    const newMessages = [...messages];
    newMessages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: ''
        }
      ]
    });
    setMessages(newMessages);
  };

  useEffect(() => {
    if (models.isFetched && models.data) {
      const firstModelId = models?.data?.[0]?.id;
      if (firstModelId) {
        setSelectedModelId(firstModelId);
      }
    }
  }, [models.isFetched]);

  const [isSending, setIsSending] = useState(false);

  const selectedModel = models.data?.find(
    (model) => model.id === selectedModelId
  );
  const fetchControllerRef = useRef(new AbortController());
  const signal = fetchControllerRef.current.signal;

  const submit = async () => {
    if (isSending) {
      // cancel
      fetchControllerRef.current.abort();
      setIsSending(false);
    } else {
      setIsSending(true);

      const url = 'http://api.swarms.world/v1/chat/completions';

      const messagesToSend = messages.map((message) => ({
        ...message
      }));
      if (systemMessage.trim() != '') {
        messagesToSend.push({
          role: 'system',
          content: systemMessage
        });
      }
      const data = {
        model: selectedModel?.unique_name,
        messages: messagesToSend,
        temperature,
        top_p: topP,
        max_tokens: maxTokens
      };

      // Send the request
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);

          // Print the response from the server
          //   const message=data.
          const message = data.choices[0].message as ChatCompletionMessageParam;
          //   append
          const newMessages = [...messages];
          newMessages.push(message);
          setMessages(newMessages);
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsSending(false);
        });

      //
    }
  };
  return {
    temperature,
    setTemperature,
    topP,
    setTopP,
    maxTokens,
    setMaxTokens,
    systemMessage,
    setSystemMessage,
    messages,
    submit,
    addMessage,
    setMessages,
    models,
    selectedModel,
    selectedModelId,
    setSelectedModelId,
    isSending
  };
};

export default usePlayground;
