<?php

namespace App\Models;

use CodeIgniter\Model;
use Ramsey\Uuid\Uuid;
use CodeIgniter\I18n\Time;

class BusModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'bus';
    protected $primaryKey       = 'busId';
    protected $casts = ['busId' => 'string'];
    protected $useAutoIncrement  = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['classId', 'busFleetId', 'created_at', 'updated_at', 'code'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert = ['generateUUID', 'beforeInsert'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = ['beforeUpdate'];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
    protected function generateUUID(array $data)
    {
        $data['data']['busId'] = Uuid::uuid4()->toString();
        return $data;
    }

    protected function beforeInsert(array $data)
    {
        $time = new Time("now");
        $data['data']['created_at'] = $time->getTimestamp();
        $data['data']['updated_at'] = $time->getTimestamp();
        return $data;
    }

    protected function beforeUpdate(array $data)
    {
        $time = new Time("now");
        $data['data']['updated_at'] = $time->getTimestamp();
        return $data;
    }
}
