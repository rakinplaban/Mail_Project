document.addEventListener('DOMContentLoaded', function() {
  const emaildetails = document.createElement('div');
  emaildetails.setAttribute('id','email-details');
  document.querySelector('.container').append(emaildetails);
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = sendmail;
  /*const emaildetails = document.createElement('div').setAttribute('id','email-details');
  document.body.append(emaildetails);*/
  // By default, load the inbox
  load_mailbox('inbox');
  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  //document.querySelector('#email-details').style.display = 'none';
  if(document.querySelector('#email-details') !== null){
    document.querySelector('#email-details').style.display = 'none';
  }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function sendmail(){
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  localStorage.clear();
  //location.reload();
  load_mailbox('sent');
  return false;
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  if(document.querySelector('#email-details') !== null){
    document.querySelector('#email-details').style.display = 'none';
  }

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  localStorage.clear();
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    emails.forEach(email => display_mailbox(email,mailbox));
  });
  //display_mailbox(emails, mailbox);
  
}


function display_mailbox(email,mailbox){
  const emaildisplay = document.createElement('div');
  emaildisplay.setAttribute('id','emaildisplay');

  const emaildisplaydet = document.createElement('div');
  emaildisplaydet.setAttribute('id',`${email.id}`);
  emaildisplaydet.className = 'rina';
  //emaildisplay.className = "border border-dark";
  const id = document.createElement('div');
  id.setAttribute('id','id');
  id.innerHTML = email.id;
  emaildisplaydet.append(id);
  const recipients = document.createElement('div');
  recipients.setAttribute('id','recipients');
  console.log(`Mailbox : ${mailbox}`);
  if(mailbox === "sent"){
    recipients.innerHTML = email.recipients[0];
  }
  else{
    recipients.innerHTML = email.sender;
  }
  emaildisplaydet.append(recipients);

  const subject = document.createElement('div');
  subject.setAttribute('id','subject');
  subject.innerHTML = email.subject;
  emaildisplaydet.append(subject);

  const timestamp = document.createElement('div');
  timestamp.setAttribute('id','timestamp');
  timestamp.innerHTML = email.timestamp;
  emaildisplaydet.append(timestamp);
  emaildisplay.append(emaildisplaydet)
  if(mailbox === "inbox"){
    const archive = document.createElement('div');
    archive.setAttribute('id','archive');
    const archivebtn = document.createElement('button');
    archivebtn.setAttribute('id','archivebtn');
    archivebtn.className = "btn btn-danger"
    archivebtn.innerHTML = `Archive`;
    archive.append(archivebtn);
    emaildisplay.append(archive);
    archivebtn.onclick = function() {
      send_archive(email.id, email.archived)
    };
  }

  if(mailbox === "archive"){
    const archive = document.createElement('div');
    archive.setAttribute('id','archive');
    const unarchivebtn = document.createElement('button');
    unarchivebtn.setAttribute('id','unarchivebtn');
    unarchivebtn.className = "btn btn-warning"
    unarchivebtn.innerHTML = `Unarchive`;
    archive.append(unarchivebtn);
    emaildisplay.append(archive);
    unarchivebtn.onclick = function() {
      back_unarchive(email.id, email.archived)
    };
  }
  if(email.read === false){
    emaildisplay.className = "bg bg-whilte border border-dark";
  }
  else{
    //document.querySelector('#emaildisplay').style.color = rgb(128,128,128);
    emaildisplay.className = "bg bg-secondary border border-dark text text-white";
  }
  //document.addEventListener('click')
  //document.body.appendChild(emaildisplay);
  document.querySelector('#emails-view').append(emaildisplay);
  emaildisplaydet.addEventListener('click', () =>{
    reading_status(email.id);
    emaildisplay.className = "bg bg-secondary border border-dark text text-white";
    show_mail(email);
  });
}

function send_archive(email,archived){
  var archive_status = !archived;
 
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive_status
    })
  })
  //load_mailbox('archive');
  //console.log(`${email} has status ${archive_status}`);
  window.location.reload();
  load_mailbox('archive');
}

function back_unarchive(email,archived){
  var archive_status = !archived;
 
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive_status
    })
  })
  //load_mailbox('inbox');
  //console.log(`${email} has status ${archive_status}`);
  //window.location.reload();
  load_mailbox('inbox');
}

function reading_status(email){
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function show_mail(email){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-details').style.display = 'block';

  fetch(`/emails/${email.id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      // ... do something else with email ...
  });

  const description = document.querySelector('#email-details');

  /*const id = document.createElement('div');
  id.setAttribute('id','id');
  console.log(email.id);
  id.innerHTML = email.id;
  description.append(id);*/
  
  const senderh5 = document.createElement('h5');
  senderh5.setAttribute('id','senderh5');
  console.log(email.sender);
  senderh5.innerHTML = `Sender: ${email.sender}`;
  description.append(senderh5);

  const recipientsh5 = document.createElement('h5');
  recipientsh5.setAttribute('id','recipientsh5');
  console.log(email.recipients[0]);
  recipientsh5.innerHTML = `Recipient: ${email.recipients[0]}`;
  description.append(recipientsh5);

  const subjecth1 = document.createElement('h5');
  subjecth1.setAttribute('id','subjecth1');
  subjecth1.innerHTML = `Subject: ${email.subject}`;
  description.append(subjecth1);

  const timestamph5 = document.createElement('h5');
  timestamph5.setAttribute('id','timestamph5');
  timestamph5.innerHTML = `Timestamp: ${email.timestamp}`;
  description.append(timestamph5);

  const replybtn = document.createElement('button');
  replybtn.setAttribute('id','replybtn');
  replybtn.className = 'btn btn-primary';
  replybtn.innerHTML = 'Reply';
  description.append(replybtn);
  replybtn.onclick = function(){
    reply_email(email);
    document.querySelector('#email-details').style.display = 'none';
  }
  /*if(document.querySelector('#replybtn') !==null)
    document.querySelector('#replybtn').onclick = compose_email;
  */

  const emailbody = document.createElement('div');
  emailbody.setAttribute('id','emailbody');
  emailbody.className = "bg bg-light";
  emailbody.innerHTML = email.body;
  description.append(emailbody);

  document.querySelector('#inbox').addEventListener('click', () => {
    location.reload();
    load_mailbox('inbox');
  });
  document.querySelector('#sent').addEventListener('click', () => { 
    location.reload()
    load_mailbox('sent')});
  document.querySelector('#archived').addEventListener('click', () => { 
    location.reload()
    load_mailbox('archive')});
  document.querySelector('#compose').addEventListener('click', () =>{ compose_email()
  location.reload();
  });

  /*if(email.read === false){
    email.read = true;
  }*/
  //localStorage.clear();
  //document.querySelector('#email-details').append(description);
  //document.body.append(emaildetails);
  
}

function reply_email(email) {
  const emailid = document.createElement('div');
  emailid.setAttribute('id','emailid');
  emailid.innerHTML = email.id;
  emailid.style.display = 'none';
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  //document.querySelector('#email-details').style.display = 'none';
  if(document.querySelector('#email-details') !== null){
    document.querySelector('#email-details').style.display = 'none';
  }

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  subjectofmail = `${email.subject}`;
  re = 'Re: ';
  if(email.subject.includes(re)){
     document.querySelector('#compose-subject').value = email.subject;
  }
  else{
     document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  }
  //document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
}