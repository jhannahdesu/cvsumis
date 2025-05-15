<!-- Send Email Modal -->
<div class="modal fade" id="SendEmailModal" tabindex="-1" aria-labelledby="SendEmailModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <form method="POST" action="{{ route('send.email') }}">
      @csrf
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="SendEmailModalLabel">Send Email to User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="recipient_email" class="form-label">Recipient</label>
            <select name="recipient_email" id="recipient_email" class="form-control" required>
              <option value="">Select recipient</option>
              @foreach(\App\Models\User::all() as $user)
                <option value="{{ $user->email }}">{{ $user->email }} ({{ $user->firstname }} {{ $user->lastname }})</option>
              @endforeach
            </select>
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">Message</label>
            <textarea name="message" id="message" class="form-control" rows="4" required placeholder="Enter your note to the user"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Send Email</button>
        </div>
      </div>
    </form>
  </div>
</div>