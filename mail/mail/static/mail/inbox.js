document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = sendmail;

  // By default, load the inbox
  //load_mailbox('inbox');
  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

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
  load_mailbox('sent');
  return false;
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

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
  const id = document.createElement('div');
  id.setAttribute('id','id');
  id.innerHTML = email.id;
  emaildisplay.append(id);
  const recipients = document.createElement('div');
  recipients.setAttribute('id','recipients');
  console.log(`Mailbox : ${mailbox}`);
  if(mailbox === "sent"){
    recipients.innerHTML = email.recipients[0];
  }
  else{
    recipients.innerHTML = email.sender;
  }
  emaildisplay.append(recipients);

  const subject = document.createElement('div');
  subject.setAttribute('id','subject');
  subject.innerHTML = email.subject;
  emaildisplay.append(subject);

  const timestamp = document.createElement('div');
  timestamp.setAttribute('id','timestamp');
  timestamp.innerHTML = email.timestamp;
  emaildisplay.append(timestamp);

  if(mailbox === "inbox"){
    const archive = document.createElement('div');
    archive.setAttribute('id','archive');
    const archivebtn = document.createElement('button');
    archivebtn.setAttribute('id','archivebtn');
    archivebtn.className = "btn btn-danger"
    archivebtn.innerHTML = `Archive`;
    archive.append(archivebtn);
    emaildisplay.append(archive);
   document.addEventListener('click', function() {
      send_archive(email.id, email.archived)
    });
  }

  if(mailbox === "archive"){
    const archive = document.createElement('div');
    archive.setAttribute('id','archive');
    const archivebtn = document.createElement('button');
    archivebtn.setAttribute('id','archivebtn');
    archivebtn.className = "btn btn-warning"
    archivebtn.innerHTML = `Unarchive`;
    archive.append(archivebtn);
    emaildisplay.append(archive);
   document.addEventListener('click', function() {
      back_unarchive(email.id, email.archived)
    });
  }
  
  //document.addEventListener('click')
  document.body.appendChild(emaildisplay);
}

function send_archive(email,archived){
  var archive_status = !archived;
 
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive_status
    })
  })
  load_mailbox('archive');
  console.log(`${email} has status ${archive_status}`);
}

function back_unarchive(email,archived){
  var archive_status = !archived;
 
  fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive_status
    })
  })
  load_mailbox('inbox');
  console.log(`${email} has status ${archive_status}`);
}