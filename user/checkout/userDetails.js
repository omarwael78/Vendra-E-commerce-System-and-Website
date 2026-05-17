export function userDetails(user) {
  return ` <div class="card shadow-lg border-0 mb-4 p-4">
                <h5 class="card-title fw-bold mb-4">Shipping Information</h5>
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label text-muted small">Full Name *</label>
                        <input type="text" class="form-control" id="fullName" placeholder="John Doe" value="${user.name}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">Email Address *</label>
                        <input type="email" class="form-control" id="email" placeholder="you@example.com" value="${user.email}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">Phone Number *</label>
                        <input type="tel" class="form-control" id="phone" placeholder="+1 (555) 123-4567" value="${user.phone}">
                    </div>
                    <div class="col-12">
                        <label class="form-label text-muted small">Street Address *</label>
                        <input type="text" class="form-control" id="address" placeholder="123 Main Street" value="${user.address}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">City *</label>
                        <input type="text" class="form-control" id="city" placeholder="New York" value="${user.city}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">State *</label>
                        <input type="text" class="form-control" id="state" placeholder="NY" value="${user.state}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">ZIP Code *</label>
                        <input type="text" class="form-control" id="zipCode" placeholder="10001" value="${user.zipcode}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small">Country *</label>
                        <select class="form-select" id="country">
                            <option value="" selected disabled>Select Country</option>
                            <option value="US">United States</option>
                            <option value="EG">Egypt</option>
                            <option value="UK">United Kingdom</option>
                        </select>
                    </div>
                </div>
        </div>`;
}
