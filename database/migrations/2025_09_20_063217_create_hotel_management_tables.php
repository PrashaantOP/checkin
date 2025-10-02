<?php



use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ---------------- Hotels ----------------
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('country');
            $table->string('pincode');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // ---------------- Hotel Branches ----------------
        Schema::create('hotel_branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name');
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // ---------------- Amenities ----------------
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // ---------------- Rooms ----------------
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('max_guests');
            $table->decimal('base_price', 10, 2);
            $table->enum('status', ['available', 'unavailable'])->default('available');
            $table->timestamps();
        });

        // ---------------- Room Prices ----------------
        Schema::create('room_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->date('date');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        // ---------------- Room Inventory ----------------
        Schema::create('room_inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->string('room_number');
            $table->string('floor_number')->nullable();
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->timestamps();
        });

        // ---------------- Room Amenities Pivot ----------------
        Schema::create('room_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->foreignId('amenity_id')->constrained('amenities')->cascadeOnDelete();
            $table->timestamps();
        });

        // ---------------- Guests ----------------
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('id_proof_type')->nullable();
            $table->string('id_proof_number')->nullable();
            $table->boolean('is_profile_completed')->default(false);
            $table->timestamps();
        });

        // ---------------- Roles ----------------
        // Schema::create('roles', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('description')->nullable();
        // });

        // ---------------- Users ----------------
        // Schema::create('users', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('email')->unique();
        //     $table->string('password');
        //     $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
        //     $table->rememberToken();
        //     $table->timestamps();
        // });

        // ---------------- Bookings ----------------
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('booking_number')->unique();
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('total_guests');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'partial'])->default('pending');
            $table->timestamps();
        });

        Schema::create('booking_guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('guest_id')->constrained('guests')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['booking_id', 'guest_id']); // Optional: enforce no duplicates
        });

        // ---------------- Booking Rooms ----------------
        Schema::create('booking_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('room_inventory_id')->constrained('room_inventory')->cascadeOnDelete();
            $table->integer('guests_count');
            $table->decimal('price_per_night', 10, 2);
            $table->integer('nights');
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });

        // ---------------- Packages ----------------
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // ---------------- Booking Packages ----------------
        Schema::create('booking_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('package_id')->constrained('packages')->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });

        // ---------------- Checkins ----------------
        Schema::create('checkins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->timestamp('checkin_time')->nullable();
            $table->foreignId('assigned_staff')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ---------------- Checkouts ----------------
        Schema::create('checkouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->timestamp('checkout_time')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ---------------- Payment Methods ----------------
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name');
            $table->string('description')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // ---------------- Payments ----------------
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('payment_method_id')->constrained('payment_methods');
            $table->string('transaction_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->dateTime('payment_date');
            $table->enum('status', ['pending', 'successful', 'failed', 'refunded'])->default('pending');
            $table->timestamps();
        });

        // ---------------- Taxes ----------------
        Schema::create('taxes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['percent', 'fixed']);
            $table->decimal('rate', 10, 2);
            $table->boolean('inclusive')->default(false);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // ---------------- Invoices ----------------
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->date('invoice_date');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2);
            $table->enum('status', ['issued', 'paid', 'cancelled'])->default('issued');
            $table->timestamps();
        });

        // ---------------- hotel user ----------------
        Schema::create('hotel_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('role', ['admin', 'staff'])->default('staff');
            $table->enum('status', [1, 0])->default(1);
            $table->timestamps();

            $table->unique(['hotel_id', 'user_id']);
        });

        // ---------------- Maintenance ----------------
        Schema::create('maintenance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('room_inventory_id')->constrained('room_inventory')->cascadeOnDelete();
            $table->text('issue');
            $table->date('reported_date');
            $table->date('resolved_date')->nullable();
            $table->enum('status', ['pending', 'resolved'])->default('pending');
            $table->timestamps();
        });

        // ---------------- Reviews ----------------
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('guest_id')->constrained('guests')->cascadeOnDelete();
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // ---------------- Notifications ----------------
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('maintenance');
        Schema::dropIfExists('hotel_users');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('taxes');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('payment_methods');
        Schema::dropIfExists('checkouts');
        Schema::dropIfExists('checkins');
        Schema::dropIfExists('booking_packages');
        Schema::dropIfExists('packages');
        Schema::dropIfExists('booking_rooms');
        Schema::dropIfExists('bookings');
        // Schema::dropIfExists('users');
        // Schema::dropIfExists('roles');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('room_amenities');
        Schema::dropIfExists('room_inventory');
        Schema::dropIfExists('room_prices');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('hotel_branches');
        Schema::dropIfExists('hotels');
    }
};
