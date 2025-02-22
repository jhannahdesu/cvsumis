@extends('layouts.app')

@section('content')

    <div class="container">
        <div class="row">
            <section class="col-lg-12">    
                <article class="card">
                    <div class="card-body">
                        <h5 class="card-title">Users List</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <div class="ms-auto d-flex">
                                <form class="form-inline me-2">
                                    <input class="form-control" type="search" oninput="searcRoles(value)" placeholder="Search" aria-label="Search">
                                </form>
                                <button type="button" class="btn btn-outline-primary" id="add-user-modal">
                                    <i class="bi bi-plus-circle-fill"></i>
                                </button>
                            </div>
                        </div>
                        <div id="roles-table"></div>
                    </div>
                </article>
            </section>
        </div>
    </div>
@include('layouts.modals.roles_access_modal')
@endsection
@section('scripts')
  <script src="{{ asset('js/role_access.js') }}"></script>
@endsection