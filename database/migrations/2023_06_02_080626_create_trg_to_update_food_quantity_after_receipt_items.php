<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
        CREATE OR REPLACE TRIGGER trg_to_update_food_quantity_after_receipt_items
        AFTER UPDATE ON receipt_items 
        FOR EACH ROW 
        BEGIN 
            IF OLD.food_id = NEW.food_id AND OLD.food_quantity <> NEW.food_quantity THEN
                UPDATE foods 
                SET quantity = quantity - OLD.food_quantity 
                WHERE id = OLD.food_id;
                
                UPDATE foods 
                SET quantity = quantity + NEW.food_quantity 
                WHERE id = NEW.food_id;
            ELSEIF OLD.food_id <> NEW.food_id AND OLD.food_quantity = NEW.food_quantity THEN
                UPDATE foods 
                SET quantity = quantity - OLD.food_quantity 
                WHERE id = OLD.food_id;
                
                UPDATE foods 
                SET quantity = quantity + NEW.food_quantity 
                WHERE id = NEW.food_id;
            ELSEIF OLD.food_id <> NEW.food_id AND OLD.food_quantity <> NEW.food_quantity THEN
                UPDATE foods 
                SET quantity = quantity - OLD.food_quantity 
                WHERE id = OLD.food_id;
                
                UPDATE foods 
                SET quantity = quantity + NEW.food_quantity 
                WHERE id = NEW.food_id;
            END IF;
        END;
    ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trg_to_update_food_quantity_after_receipt_items');
    }
};
