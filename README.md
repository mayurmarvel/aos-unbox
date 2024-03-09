# AOS Unbox
An Unofficial AOS Inbox


## Configuring Unbox

- Copy this lua code

```lua
Handlers.add('inboxCount', Handlers.utils.hasMatchingTag('Action', '#Inbox'), function(msg)
    -- Assuming Inbox is an array containing the messages
    local inboxCount = #Inbox
    
    -- Send the inbox count as a response
    ao.send({
      Target = msg.From,
      Tags = { InboxCount = tostring(inboxCount) }
    })
  end)
  

  Handlers.add('inboxMessage', Handlers.utils.hasMatchingTag('Action', 'CheckInbox'), function(msg)
    -- Extract the index from the tags
    local index = tonumber(msg.Tags.Index)
  
    -- Check if the index is valid and within the range of the inbox messages
    if index and index > 0 and index <= #Inbox then
      -- Retrieve the message details based on the index
      local message = Inbox[index]
      
      -- Send the message details as a response
      ao.send({
        Target = msg.From,
        Tags = { 
          Action = "Inbox",
          Index = tostring(index),
          MessageDetails = message
        }
      })
    else
      -- If the index is invalid or out of range, send an error message
      ao.send({
        Target = msg.From,
        Tags = { Error = "Invalid inbox message index" }
      })
    end
  end)
```

- save it as `inbox.lua`


- start the aos process & load the file

        .load inbox.lua


- get your process id 

        ao.id

- visit the [aos-unbox](https://aos-unbox.vercel.app/) site and enter your pocess id to login



## Credits
- Notification Sounds : [Click here](https://notificationsounds.com/)
- Bgjar SVG : [Click here](https://bgjar.com/)
- @uiwjs/react-json-view : [Click here](https://github.com/uiwjs/react-json-view)
- Dice Bear Avatars : [click here](https://www.dicebear.com/styles/bottts-neutral/)
- shadcn/ui : [Click here](https://ui.shadcn.com/)
